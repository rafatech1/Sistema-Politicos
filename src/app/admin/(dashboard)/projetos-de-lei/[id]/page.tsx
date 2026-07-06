import { notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { ResourceForm } from '@/components/admin/resource-form';
import { FIELDS } from '../config';
import { AdminPageHeader } from '@/components/admin/page-header';

export default async function EditarProjetoDeLeiPage({ params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, 'content:write')) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Você não tem permissão para editar projetos de lei.
      </div>
    );
  }

  const pl = await prisma.projetoDeLei.findUnique({ where: { id: params.id } });
  if (!pl) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Editar projeto de lei" backHref="/admin/projetos-de-lei" />
      <ResourceForm
        fields={FIELDS}
        apiPath="/api/admin/projetos-de-lei"
        itemId={pl.id}
        initialData={JSON.parse(JSON.stringify(pl))}
        redirectTo="/admin/projetos-de-lei"
      />
    </div>
  );
}
