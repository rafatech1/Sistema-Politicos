import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { SectionHeading } from '@/components/public/section-heading';

export async function NewsSection() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
    take: 3,
    include: { category: true },
  });
  if (posts.length === 0) return null;

  return (
    <section className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Acompanhe" title="Últimas Notícias" ctaLabel="Ver todas" ctaHref="/noticias" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/noticias/${post.slug}`}
              className="group flex flex-col overflow-hidden border-2 border-slate-900 bg-white shadow-hard-sm transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard"
            >
              <div className="relative aspect-video overflow-hidden border-b-2 border-slate-900 bg-slate-100">
                {post.coverImageUrl && (
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                {post.category && (
                  <span className="absolute left-3 top-3 border-2 border-slate-900 bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-slate-900">
                    {post.category.name}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                {post.publishedAt && (
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    {post.publishedAt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                )}
                <h3 className="mt-1.5 font-display font-black uppercase leading-tight text-slate-900 transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
                {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{post.excerpt}</p>}
                <span
                  aria-hidden
                  className="mt-auto inline-flex w-fit items-center gap-1 pt-3 text-xs font-bold uppercase tracking-wide text-slate-400 transition-all group-hover:gap-2 group-hover:text-primary"
                >
                  Ler matéria <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
