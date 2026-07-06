import { getCachedSessionUser } from '@/lib/auth/session.cached';
import { hasPermission } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { ResourceForm } from '@/components/admin/resource-form';
import { buildFields } from '../config';
import { AdminPageHeader } from '@/components/admin/page-header';

export default async function NovaPropostaPage() {
  const user = await getCachedSessionUser();
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
      <AdminPageHeader title="Nova proposta" backHref="/admin/propostas" />
      <ResourceForm fields={buildFields(eixos)} apiPath="/api/admin/propostas" redirectTo="/admin/propostas" />
    </div>
  );
}
