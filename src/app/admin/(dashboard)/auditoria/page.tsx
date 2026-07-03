import { getSessionUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { AuditLogManager } from './audit-log-manager';

export default async function AuditoriaPage() {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, 'audit:read')) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Você não tem permissão para acessar esta página.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Auditoria</h1>
      <AuditLogManager />
    </div>
  );
}
