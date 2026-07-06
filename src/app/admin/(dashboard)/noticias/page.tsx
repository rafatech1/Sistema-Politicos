import { getSessionUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { NoticiasTable } from './table';
import { AdminPageHeader } from '@/components/admin/page-header';

export default async function NoticiasPage() {
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
      <AdminPageHeader title="Notícias" />
      <NoticiasTable canWrite={hasPermission(user.role, 'content:write')} />
    </div>
  );
}
