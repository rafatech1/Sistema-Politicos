import { NextResponse, type NextRequest } from 'next/server';
import { requireUser } from '@/lib/auth/session';
import { requirePermission } from '@/lib/auth/rbac';
import {
  getUserById,
  updateUser,
  deleteUser,
  countActiveAdmins,
} from '@/lib/services/user.service';
import { revokeAllUserTokens } from '@/lib/auth/refresh-token';
import { updateUserSchema } from '@/lib/validations/user.schema';
import { writeAuditLog } from '@/lib/audit/audit-log';
import { handleApiError, jsonError } from '@/lib/utils/api-response';
import { requestMeta } from '@/lib/utils/request-meta';

interface RouteParams {
  params: { id: string };
}

async function wouldRemoveLastAdmin(
  targetId: string,
  target: { role: string; isActive: boolean },
  data: { role?: string; isActive?: boolean },
): Promise<boolean> {
  const isTargetActiveAdmin = target.role === 'ADMIN' && target.isActive;
  if (!isTargetActiveAdmin) return false;

  const willStayActiveAdmin = (data.role ?? target.role) === 'ADMIN' && (data.isActive ?? target.isActive);
  if (willStayActiveAdmin) return false;

  const remaining = await countActiveAdmins(targetId);
  return remaining === 0;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireUser();
    requirePermission(user, 'users:manage');

    const target = await getUserById(params.id);
    if (!target) return jsonError('Usuário não encontrado.', 404);

    const data = updateUserSchema.parse(await request.json());

    if (await wouldRemoveLastAdmin(params.id, target, data)) {
      return jsonError('Não é possível remover o último administrador ativo.', 400);
    }

    const updated = await updateUser(params.id, data);

    if (data.isActive === false || data.password) {
      await revokeAllUserTokens(params.id);
    }

    const meta = requestMeta(request);
    await writeAuditLog({
      entityType: 'User',
      entityId: params.id,
      action: 'UPDATE',
      beforeJson: target,
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

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireUser();
    requirePermission(user, 'users:manage');

    const target = await getUserById(params.id);
    if (!target) return jsonError('Usuário não encontrado.', 404);

    if (await wouldRemoveLastAdmin(params.id, target, {})) {
      return jsonError('Não é possível remover o último administrador ativo.', 400);
    }

    const deleted = await deleteUser(params.id);

    const meta = requestMeta(request);
    await writeAuditLog({
      entityType: 'User',
      entityId: params.id,
      action: 'DELETE',
      beforeJson: deleted,
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
