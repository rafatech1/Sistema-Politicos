import { notFound } from 'next/navigation';
import { getCachedSessionUser } from '@/lib/auth/session.cached';
import { hasPermission } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { ResourceForm } from '@/components/admin/resource-form';
import { buildFields } from '../config';
import { AdminPageHeader } from '@/components/admin/page-header';

export default async function EditarPropostaPage({ params }: { params: { id: string } }) {
  const user = await getCachedSessionUser();
  if (!user || !hasPermission(user.role, 'content:write')) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Você não tem permissão para editar propostas.
      </div>
    );
  }

  const [proposta, eixos] = await Promise.all([
    prisma.proposta.findUnique({ where: { id: params.id } }),
    prisma.eixoTematico.findMany({ orderBy: { order: 'asc' } }),
  ]);
  if (!proposta) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Editar proposta" backHref="/admin/propostas" />
      <ResourceForm
        fields={buildFields(eixos)}
        apiPath="/api/admin/propostas"
        itemId={proposta.id}
        initialData={JSON.parse(JSON.stringify(proposta))}
        redirectTo="/admin/propostas"
      />
    </div>
  );
}
