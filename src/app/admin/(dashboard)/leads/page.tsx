import { getSessionUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { LeadsManager } from './leads-manager';

export default async function LeadsAdminPage() {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, 'leads:manage')) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Você não tem permissão para acessar os leads.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Leads</h1>
      <LeadsManager />
    </div>
  );
}
