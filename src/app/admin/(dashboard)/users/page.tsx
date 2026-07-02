import { getSessionUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { listUsers } from '@/lib/services/user.service';
import { UsersManager } from './users-manager';

export default async function AdminUsersPage() {
  const user = await getSessionUser();

  if (!user || !hasPermission(user.role, 'users:manage')) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Você não tem permissão para gerenciar usuários.
      </div>
    );
  }

  const users = await listUsers();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Usuários da equipe</h1>
      <UsersManager initialUsers={JSON.parse(JSON.stringify(users))} currentUserId={user.id} />
    </div>
  );
}
