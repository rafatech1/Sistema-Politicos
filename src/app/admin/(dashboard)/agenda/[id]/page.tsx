import { notFound } from 'next/navigation';
import { getCachedSessionUser } from '@/lib/auth/session.cached';
import { hasPermission } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { ResourceForm } from '@/components/admin/resource-form';
import { FIELDS } from '../config';
import { AdminPageHeader } from '@/components/admin/page-header';

export default async function EditarEventoPage({ params }: { params: { id: string } }) {
  const user = await getCachedSessionUser();
  if (!user || !hasPermission(user.role, 'content:write')) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Você não tem permissão para editar eventos.
      </div>
    );
  }

  const evento = await prisma.evento.findUnique({ where: { id: params.id } });
  if (!evento) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Editar evento" backHref="/admin/agenda" />
      <ResourceForm
        fields={FIELDS}
        apiPath="/api/admin/agenda"
        itemId={evento.id}
        initialData={JSON.parse(JSON.stringify(evento))}
        redirectTo="/admin/agenda"
      />
    </div>
  );
}
