import { NextResponse, type NextRequest } from 'next/server';
import type { ZodType } from 'zod';
import { requireUser, type SessionUser } from '@/lib/auth/session';
import { requirePermission, hasPermission, type Permission } from '@/lib/auth/rbac';
import { ForbiddenError } from '@/lib/auth/errors';
import { writeAuditLog } from '@/lib/audit/audit-log';
import { handleApiError, jsonError } from '@/lib/utils/api-response';
import { requestMeta } from '@/lib/utils/request-meta';
import { slugify } from '@/lib/utils/slugify';

// Delegate do Prisma tipado de forma solta de propósito: o objetivo desta
// fábrica é eliminar a repetição do esqueleto auth→RBAC→zod→prisma→audit em
// ~13 recursos, não fazer type-safety fim-a-fim do Prisma Client (isso já é
// garantido pelos schemas zod de cada recurso, que são fortemente tipados).
type AnyDelegate = {
  findMany: (args?: any) => Promise<any[]>;
  findUnique: (args: any) => Promise<any | null>;
  create: (args: any) => Promise<any>;
  update: (args: any) => Promise<any>;
  delete: (args: any) => Promise<any>;
};

export interface CrudFactoryConfig<TCreate, TUpdate> {
  entityType: string;
  delegate: AnyDelegate;
  createSchema: ZodType<TCreate>;
  updateSchema: ZodType<TUpdate>;
  /** Permissão exigida para leitura (GET). */
  permission: Permission;
  /** Permissão exigida para escrita (POST/PATCH/DELETE). Padrão: igual a `permission`. */
  writePermission?: Permission;
  findManyArgs?: Record<string, unknown>;
  /** Deriva o slug a partir do payload de criação quando ausente (ex: a partir do título). */
  deriveSlug?: (data: TCreate) => string | undefined;
  /** Campo que representa o estado de publicação e os valores que exigem `content:publish`. */
  publishGate?: { field: string; publishedValues: string[] };
  /** Ajuste final nos dados antes de salvar, em CREATE e UPDATE (ex: preencher publishedAt ao publicar). */
  beforeSave?: (data: Record<string, unknown>, user: SessionUser) => void;
  /** Ajuste aplicado só em CREATE (ex: definir authorId como o usuário atual). */
  beforeCreate?: (data: Record<string, unknown>, user: SessionUser) => void;
}

// Inputs de formulário HTML sempre mandam string, mesmo para campos opcionais
// vazios (URL de imagem, FK opcional). Zod valida a string vazia via
// `.or(z.literal(''))` nesses campos; aqui ela vira `null` antes de chegar no
// Prisma (string vazia não é um valor válido de URL/FK).
function nullifyEmptyStrings(data: Record<string, unknown>): void {
  for (const key of Object.keys(data)) {
    if (data[key] === '') data[key] = null;
  }
}

function checkPublishGate(
  config: Pick<CrudFactoryConfig<unknown, unknown>, 'publishGate'>,
  user: SessionUser,
  data: Record<string, unknown>,
): void {
  if (!config.publishGate) return;
  const value = data[config.publishGate.field];
  if (
    typeof value === 'string' &&
    config.publishGate.publishedValues.includes(value) &&
    !hasPermission(user.role, 'content:publish')
  ) {
    throw new ForbiddenError('Somente administradores podem publicar este conteúdo.');
  }
}

export function createListCreateHandlers<TCreate, TUpdate>(config: CrudFactoryConfig<TCreate, TUpdate>) {
  async function GET() {
    try {
      const user = await requireUser();
      requirePermission(user, config.permission);
      const items = await config.delegate.findMany(config.findManyArgs);
      return NextResponse.json(items);
    } catch (err) {
      return handleApiError(err);
    }
  }

  async function POST(request: NextRequest) {
    try {
      const user = await requireUser();
      requirePermission(user, config.writePermission ?? config.permission);

      const parsed = config.createSchema.parse(await request.json());
      const data = { ...parsed } as Record<string, unknown>;
      nullifyEmptyStrings(data);

      if (config.deriveSlug && !data.slug) {
        const derived = config.deriveSlug(parsed);
        if (derived) data.slug = slugify(derived);
      }

      config.beforeSave?.(data, user);
      config.beforeCreate?.(data, user);
      checkPublishGate(config, user, data);

      const created = await config.delegate.create({ data });

      const meta = requestMeta(request);
      await writeAuditLog({
        entityType: config.entityType,
        entityId: created.id,
        action: 'CREATE',
        afterJson: created,
        userId: user.id,
        userEmailSnapshot: user.email,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      });

      return NextResponse.json(created, { status: 201 });
    } catch (err) {
      return handleApiError(err);
    }
  }

  return { GET, POST };
}

export function createItemHandlers<TCreate, TUpdate>(config: CrudFactoryConfig<TCreate, TUpdate>) {
  async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const user = await requireUser();
      requirePermission(user, config.permission);
      const item = await config.delegate.findUnique({ where: { id: params.id } });
      if (!item) return jsonError('Não encontrado.', 404);
      return NextResponse.json(item);
    } catch (err) {
      return handleApiError(err);
    }
  }

  async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const user = await requireUser();
      requirePermission(user, config.writePermission ?? config.permission);

      const before = await config.delegate.findUnique({ where: { id: params.id } });
      if (!before) return jsonError('Não encontrado.', 404);

      const parsed = config.updateSchema.parse(await request.json());
      const data = { ...parsed } as Record<string, unknown>;
      nullifyEmptyStrings(data);

      config.beforeSave?.(data, user);
      checkPublishGate(config, user, data);

      const updated = await config.delegate.update({ where: { id: params.id }, data });

      const meta = requestMeta(request);
      await writeAuditLog({
        entityType: config.entityType,
        entityId: params.id,
        action: 'UPDATE',
        beforeJson: before,
        afterJson: updated,
        userId: user.id,
        userEmailSnapshot: user.email,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      });

      return NextResponse.json(updated);
    } catch (err) {
      return handleApiError(err);
    }
  }

  async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const user = await requireUser();
      requirePermission(user, config.writePermission ?? config.permission);

      const before = await config.delegate.findUnique({ where: { id: params.id } });
      if (!before) return jsonError('Não encontrado.', 404);

      await config.delegate.delete({ where: { id: params.id } });

      const meta = requestMeta(request);
      await writeAuditLog({
        entityType: config.entityType,
        entityId: params.id,
        action: 'DELETE',
        beforeJson: before,
        userId: user.id,
        userEmailSnapshot: user.email,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      });

      return NextResponse.json({ success: true });
    } catch (err) {
      return handleApiError(err);
    }
  }

  return { GET, PATCH, DELETE };
}
