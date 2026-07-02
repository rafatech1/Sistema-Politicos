import { notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { ResourceForm } from '@/components/admin/resource-form';
import { FIELDS } from '../config';

export default async function EditarInstagramHighlightPage({ params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, 'content:write')) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Você não tem permissão para editar posts em destaque.
      </div>
    );
  }

  const highlight = await prisma.instagramHighlight.findUnique({ where: { id: params.id } });
  if (!highlight) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Editar post em destaque</h1>
      <ResourceForm
        fields={FIELDS}
        apiPath="/api/admin/instagram"
        itemId={highlight.id}
        initialData={JSON.parse(JSON.stringify(highlight))}
        redirectTo="/admin/instagram"
      />
    </div>
  );
}
