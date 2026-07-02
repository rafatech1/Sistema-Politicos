import { getSessionUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { getSiteSettings } from '@/lib/services/site-settings.service';
import { SettingsForm } from './settings-form';

export default async function AdminSettingsPage() {
  const user = await getSessionUser();

  if (!user || !hasPermission(user.role, 'settings:read')) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Você não tem permissão para acessar as configurações do site.
      </div>
    );
  }

  const settings = await getSiteSettings();
  const canEdit = hasPermission(user.role, 'settings:write');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Configurações do Site</h1>
      <SettingsForm initialSettings={JSON.parse(JSON.stringify(settings))} canEdit={canEdit} />
    </div>
  );
}
