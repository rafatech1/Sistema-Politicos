import { notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { ResourceForm } from '@/components/admin/resource-form';
import { FIELDS } from '../config';

export default async function EditarBadgePage({ params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, 'content:write')) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Você não tem permissão para editar badges.
      </div>
    );
  }

  const badge = await prisma.achievementBadge.findUnique({ where: { id: params.id } });
  if (!badge) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Editar badge</h1>
      <ResourceForm
        fields={FIELDS}
        apiPath="/api/admin/badges"
        itemId={badge.id}
        initialData={JSON.parse(JSON.stringify(badge))}
        redirectTo="/admin/badges"
      />
    </div>
  );
}
