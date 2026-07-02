import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

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
    }),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Notícias</h1>

      {posts.length === 0 ? (
        <p className="mt-8 text-slate-500">Nenhuma notícia publicada ainda.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/noticias/${post.slug}`}
              className="group block overflow-hidden rounded-xl border border-slate-200 transition-colors hover:border-primary"
            >
              {post.coverImageUrl && (
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-4">
                <p className="text-xs text-slate-500">{formatDate(post.publishedAt)}</p>
                <h2 className="mt-1 font-semibold text-slate-900 group-hover:text-primary">{post.title}</h2>
                {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{post.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4 text-sm">
          {page > 1 && (
            <Link href={`/noticias?page=${page - 1}`} className="font-medium text-primary hover:underline">
              ← Anteriores
            </Link>
          )}
          <span className="text-slate-500">
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/noticias?page=${page + 1}`} className="font-medium text-primary hover:underline">
              Próximas →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
