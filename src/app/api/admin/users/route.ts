import { NextResponse, type NextRequest } from 'next/server';
import { requireUser } from '@/lib/auth/session';
import { requirePermission } from '@/lib/auth/rbac';
import { listUsers, createUser, findUserByEmail } from '@/lib/services/user.service';
import { createUserSchema } from '@/lib/validations/user.schema';
import { writeAuditLog } from '@/lib/audit/audit-log';
import { handleApiError, jsonError } from '@/lib/utils/api-response';
import { requestMeta } from '@/lib/utils/request-meta';

export async function GET() {
  try {
    const user = await requireUser();
    requirePermission(user, 'users:manage');

    const users = await listUsers();
    return NextResponse.json(users);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    requirePermission(user, 'users:manage');

    const data = createUserSchema.parse(await request.json());

    if (await findUserByEmail(data.email)) {
      return jsonError('Já existe um usuário com este e-mail.', 409);
    }

    const created = await createUser(data);

    const meta = requestMeta(request);
    await writeAuditLog({
      entityType: 'User',
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
