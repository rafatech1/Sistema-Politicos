import { notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { ResourceForm } from '@/components/admin/resource-form';
import { FIELDS } from '../config';
import { AdminPageHeader } from '@/components/admin/page-header';

export default async function EditarEixoTematicoPage({ params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, 'content:write')) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Você não tem permissão para editar eixos temáticos.
      </div>
    );
  }

  const eixo = await prisma.eixoTematico.findUnique({ where: { id: params.id } });
  if (!eixo) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Editar eixo temático" backHref="/admin/eixos-tematicos" />
      <ResourceForm
        fields={FIELDS}
        apiPath="/api/admin/eixos-tematicos"
        itemId={eixo.id}
        initialData={JSON.parse(JSON.stringify(eixo))}
        redirectTo="/admin/eixos-tematicos"
      />
    </div>
  );
}
