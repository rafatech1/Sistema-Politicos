import { notFound } from 'next/navigation';
import { getCachedSessionUser } from '@/lib/auth/session.cached';
import { hasPermission } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { ResourceForm } from '@/components/admin/resource-form';
import { FIELDS } from '../config';
import { AdminPageHeader } from '@/components/admin/page-header';

export default async function EditarBadgePage({ params }: { params: { id: string } }) {
  const user = await getCachedSessionUser();
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
      <AdminPageHeader title="Editar badge" backHref="/admin/badges" />
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
