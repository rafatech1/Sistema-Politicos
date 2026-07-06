import { getSessionUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { InstagramTable } from './table';
import { AdminPageHeader } from '@/components/admin/page-header';

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
      <AdminPageHeader title="Instagram em destaque" />
      <InstagramTable canWrite={hasPermission(user.role, 'content:write')} />
    </div>
  );
}
