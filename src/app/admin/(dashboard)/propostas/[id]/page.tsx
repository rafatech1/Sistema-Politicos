import { notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { ResourceForm } from '@/components/admin/resource-form';
import { buildFields } from '../config';

export default async function EditarPropostaPage({ params }: { params: { id: string } }) {
  const user = await getSessionUser();
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
      <h1 className="text-2xl font-semibold text-slate-900">Editar proposta</h1>
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
