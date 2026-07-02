import type { AuditAction, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export interface WriteAuditLogParams {
  entityType: string;
  entityId: string;
  action: AuditAction;
  beforeJson?: unknown;
  afterJson?: unknown;
  userId?: string | null;
  userEmailSnapshot?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/** Normaliza valores arbitrários (registros Prisma com Date, etc.) para JSON puro. */
function toJson(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === undefined || value === null) return undefined;
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function writeAuditLog(params: WriteAuditLogParams): Promise<void> {
  await prisma.auditLog.create({
    data: {
      entityType: params.entityType,
      entityId: params.entityId,
      action: params.action,
      beforeJson: toJson(params.beforeJson),
      afterJson: toJson(params.afterJson),
      userId: params.userId ?? null,
      userEmailSnapshot: params.userEmailSnapshot ?? null,
      ipAddress: params.ipAddress ?? null,
      userAgent: params.userAgent ?? null,
    },
  });
}

export interface WithAuditContext {
  entityType: string;
  entityId: string;
  action: AuditAction;
  userId?: string | null;
  userEmailSnapshot?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  before?: unknown;
}

/**
 * Executa `mutate()` e grava automaticamente o AuditLog com o estado antes
 * (se informado em `ctx.before`) e depois (o retorno de `mutate()`). Pensado
 * para ser reutilizado por todos os CRUDs de conteúdo futuros, evitando
 * repetir a chamada a writeAuditLog em cada rota.
 */
export async function withAudit<T>(ctx: WithAuditContext, mutate: () => Promise<T>): Promise<T> {
  const result = await mutate();

  await writeAuditLog({
    entityType: ctx.entityType,
    entityId: ctx.entityId,
    action: ctx.action,
    beforeJson: ctx.before,
    afterJson: result,
    userId: ctx.userId,
    userEmailSnapshot: ctx.userEmailSnapshot,
    ipAddress: ctx.ipAddress,
    userAgent: ctx.userAgent,
  });

  return result;
}
