import { getCachedSessionUser } from '@/lib/auth/session.cached';
import { hasPermission } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { ResourceForm } from '@/components/admin/resource-form';
import { buildFields } from '../config';
import { AdminPageHeader } from '@/components/admin/page-header';

export default async function NovaNoticiaPage() {
  const user = await getCachedSessionUser();
  if (!user || !hasPermission(user.role, 'content:write')) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Você não tem permissão para criar notícias.
      </div>
    );
  }

  const categories = await prisma.categoria.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Nova notícia" backHref="/admin/noticias" />
      <ResourceForm fields={buildFields(categories)} apiPath="/api/admin/noticias" redirectTo="/admin/noticias" />
    </div>
  );
}
