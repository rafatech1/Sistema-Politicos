import { getSessionUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { ResourceForm } from '@/components/admin/resource-form';
import { FIELDS } from '../config';

export default async function NovoProjetoDeLeiPage() {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, 'content:write')) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Você não tem permissão para criar projetos de lei.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Novo projeto de lei</h1>
      <ResourceForm fields={FIELDS} apiPath="/api/admin/projetos-de-lei" redirectTo="/admin/projetos-de-lei" />
    </div>
  );
}
