import { notFound } from 'next/navigation';
import { getCachedSessionUser } from '@/lib/auth/session.cached';
import { hasPermission } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { ResourceForm } from '@/components/admin/resource-form';
import { FIELDS } from '../config';
import { AdminPageHeader } from '@/components/admin/page-header';

export default async function EditarItemBiografiaPage({ params }: { params: { id: string } }) {
  const user = await getCachedSessionUser();
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
      <AdminPageHeader title="Editar item da linha do tempo" backHref="/admin/biografia" />
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
