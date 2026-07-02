import { notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { ResourceForm } from '@/components/admin/resource-form';
import { buildFields } from '../config';

export default async function EditarNoticiaPage({ params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, 'content:write')) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Você não tem permissão para editar notícias.
      </div>
    );
  }

  const [post, categories] = await Promise.all([
    prisma.post.findUnique({ where: { id: params.id } }),
    prisma.categoria.findMany({ orderBy: { name: 'asc' } }),
  ]);
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Editar notícia</h1>
      <ResourceForm
        fields={buildFields(categories)}
        apiPath="/api/admin/noticias"
        itemId={post.id}
        initialData={JSON.parse(JSON.stringify(post))}
        redirectTo="/admin/noticias"
      />
    </div>
  );
}
