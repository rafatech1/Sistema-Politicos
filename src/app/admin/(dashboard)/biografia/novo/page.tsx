import { getSessionUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { ResourceForm } from '@/components/admin/resource-form';
import { FIELDS } from '../config';
import { AdminPageHeader } from '@/components/admin/page-header';

export default async function NovoItemBiografiaPage() {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, 'content:write')) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Você não tem permissão para criar itens da linha do tempo.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Novo item da linha do tempo" backHref="/admin/biografia" />
      <ResourceForm fields={FIELDS} apiPath="/api/admin/biografia" redirectTo="/admin/biografia" />
    </div>
  );
}
