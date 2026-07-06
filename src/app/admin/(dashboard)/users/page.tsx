import { getCachedSessionUser } from '@/lib/auth/session.cached';
import { hasPermission } from '@/lib/auth/rbac';
import { listUsers } from '@/lib/services/user.service';
import { UsersManager } from './users-manager';
import { AdminPageHeader } from '@/components/admin/page-header';

export default async function AdminUsersPage() {
  const user = await getCachedSessionUser();

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
      <AdminPageHeader title="Usuários da equipe" />
      <UsersManager initialUsers={JSON.parse(JSON.stringify(users))} currentUserId={user.id} />
    </div>
  );
}
