import { getCachedSessionUser } from '@/lib/auth/session.cached';
import { hasPermission } from '@/lib/auth/rbac';
import { ResourceForm } from '@/components/admin/resource-form';
import { FIELDS } from '../config';
import { AdminPageHeader } from '@/components/admin/page-header';

export default async function NovoInstagramHighlightPage() {
  const user = await getCachedSessionUser();
  if (!user || !hasPermission(user.role, 'content:write')) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Você não tem permissão para criar posts em destaque.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Novo post em destaque" backHref="/admin/instagram" />
      <ResourceForm fields={FIELDS} apiPath="/api/admin/instagram" redirectTo="/admin/instagram" />
    </div>
  );
}
