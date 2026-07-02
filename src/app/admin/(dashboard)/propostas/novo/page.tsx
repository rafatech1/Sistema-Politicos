import { getSessionUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { ResourceForm } from '@/components/admin/resource-form';
import { buildFields } from '../config';

export default async function NovaPropostaPage() {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, 'content:write')) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Você não tem permissão para criar propostas.
      </div>
    );
  }

  const eixos = await prisma.eixoTematico.findMany({ orderBy: { order: 'asc' } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Nova proposta</h1>
      <ResourceForm fields={buildFields(eixos)} apiPath="/api/admin/propostas" redirectTo="/admin/propostas" />
    </div>
  );
}
