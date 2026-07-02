import { notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { ResourceForm } from '@/components/admin/resource-form';
import { FIELDS } from '../config';

export default async function EditarItemBiografiaPage({ params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, 'content:write')) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Você não tem permissão para editar itens da linha do tempo.
      </div>
    );
  }

  const item = await prisma.biografiaTimelineItem.findUnique({ where: { id: params.id } });
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Editar item da linha do tempo</h1>
      <ResourceForm
        fields={FIELDS}
        apiPath="/api/admin/biografia"
        itemId={item.id}
        initialData={JSON.parse(JSON.stringify(item))}
        redirectTo="/admin/biografia"
      />
    </div>
  );
}
