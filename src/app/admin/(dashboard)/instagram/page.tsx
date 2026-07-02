import { getSessionUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { InstagramTable } from './table';

export default async function InstagramAdminPage() {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, 'content:read')) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Você não tem permissão para acessar esta página.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Instagram em destaque</h1>
      <InstagramTable canWrite={hasPermission(user.role, 'content:write')} />
    </div>
  );
}
