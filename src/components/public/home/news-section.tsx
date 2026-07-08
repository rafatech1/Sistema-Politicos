import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { SectionHeading } from '@/components/public/section-heading';

function formatDate(date: Date) {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

/**
 * Layout editorial: a 1ª notícia (isFeatured desc) é a manchete com
 * imagem grande; as demais viram cards horizontais compactos ao lado.
 */
export async function NewsSection() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
    take: 3,
    include: { category: true },
  });
  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;
  if (!featured) return null;

  return (
    <section className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Acompanhe" title="Últimas Notícias" ctaLabel="Ver todas" ctaHref="/noticias" />

        <div className={`grid gap-6 ${rest.length > 0 ? 'sm:grid-cols-[1.4fr_1fr]' : ''}`}>
          <Link
            href={`/noticias/${featured.slug}`}
            className="group block overflow-hidden border-2 border-slate-900 bg-white shadow-hard-sm transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard"
          >
            <div className="relative aspect-video overflow-hidden border-b-2 border-slate-900 bg-slate-100">
              {featured.coverImageUrl && (
                <Image
                  src={featured.coverImageUrl}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              {featured.category && (
                <span className="absolute left-3 top-3 border-2 border-slate-900 bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-slate-900">
                  {featured.category.name}
                </span>
              )}
            </div>
            <div className="p-6">
              {featured.publishedAt && (
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  {formatDate(featured.publishedAt)}
                </p>
              )}
              <h3 className="mt-2 font-display text-xl font-black uppercase leading-tight text-slate-900 transition-colors group-hover:text-primary sm:text-2xl">
                {featured.title}
              </h3>
              {featured.excerpt && <p className="mt-3 line-clamp-3 text-sm text-slate-600">{featured.excerpt}</p>}
            </div>
          </Link>

          {rest.length > 0 && (
            <div className="flex flex-col gap-6">
              {rest.map((post) => (
                <Link
                  key={post.id}
                  href={`/noticias/${post.slug}`}
                  className="group flex flex-1 overflow-hidden border-2 border-slate-900 bg-white shadow-hard-sm transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard"
                >
                  <div className="relative w-28 shrink-0 overflow-hidden border-r-2 border-slate-900 bg-slate-100 sm:w-36">
                    {post.coverImageUrl && (
                      <Image
                        src={post.coverImageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col justify-center p-4 sm:p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      {post.category?.name ?? (post.publishedAt ? formatDate(post.publishedAt) : '')}
                    </p>
                    <h3 className="mt-1.5 line-clamp-3 font-display font-black uppercase leading-tight text-slate-900 transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
