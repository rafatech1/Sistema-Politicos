import { getCachedSessionUser } from '@/lib/auth/session.cached';
import { hasPermission } from '@/lib/auth/rbac';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { SettingsForm } from './settings-form';
import { AdminPageHeader } from '@/components/admin/page-header';

export default async function AdminSettingsPage() {
  const user = await getCachedSessionUser();

  if (!user || !hasPermission(user.role, 'settings:read')) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Você não tem permissão para acessar as configurações do site.
      </div>
    );
  }

  const settings = await getCachedSiteSettings();
  const canEdit = hasPermission(user.role, 'settings:write');

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Configurações do Site" />
      <SettingsForm initialSettings={JSON.parse(JSON.stringify(settings))} canEdit={canEdit} />
    </div>
  );
}
