import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { SectionHeading } from '@/components/public/section-heading';

export const metadata: Metadata = { title: 'Notícias' };

const PAGE_SIZE = 9;

function formatDate(date: Date | null) {
  if (!date) return '';
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
}

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, Number(searchParams.page) || 1);

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      include: { category: true },
    }),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeading as="h1" eyebrow="Acompanhe" title="Últimas Notícias" />

      {posts.length === 0 ? (
        <p className="text-slate-500">Nenhuma notícia publicada ainda.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/noticias/${post.slug}`}
              className="group block overflow-hidden border-2 border-slate-900 bg-white shadow-hard-sm transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard"
            >
              <div className="relative aspect-video overflow-hidden border-b-2 border-slate-900 bg-slate-100">
                {post.coverImageUrl && (
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                )}
                {post.category && (
                  <span className="absolute left-3 top-3 border-2 border-slate-900 bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-slate-900">
                    {post.category.name}
                  </span>
                )}
              </div>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  {formatDate(post.publishedAt)}
                </p>
                <h2 className="mt-1.5 font-display font-black uppercase leading-tight text-slate-900 group-hover:text-primary">
                  {post.title}
                </h2>
                {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{post.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-4 text-sm">
          {page > 1 && (
            <Link
              href={`/noticias?page=${page - 1}`}
              className="border-2 border-slate-900 bg-white px-4 py-2 font-bold uppercase tracking-wide text-slate-900 transition-all hover:-translate-x-1 hover:-translate-y-1 hover:bg-accent hover:shadow-hard-sm"
            >
              ← Anteriores
            </Link>
          )}
          <span className="font-bold uppercase tracking-wide text-slate-500">
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/noticias?page=${page + 1}`}
              className="border-2 border-slate-900 bg-white px-4 py-2 font-bold uppercase tracking-wide text-slate-900 transition-all hover:-translate-x-1 hover:-translate-y-1 hover:bg-accent hover:shadow-hard-sm"
            >
              Próximas →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
