import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { SectionHeading } from '@/components/public/section-heading';
import { muralOffset, muralRotation } from '@/lib/mural';

export async function NewsSection() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
    take: 3,
    include: { category: true },
  });
  if (posts.length === 0) return null;

  return (
    <section className="bg-mural-bg px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Acompanhe" title="Últimas Notícias" ctaLabel="Ver todas" ctaHref="/noticias" variant="mural" />
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/noticias/${post.slug}`}
              className={`group relative flex flex-col bg-mural-paper p-3 pb-5 shadow-[0_10px_28px_-12px_rgba(22,35,63,0.35)] transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_16px_36px_-12px_rgba(22,35,63,0.4)] ${muralRotation(index)} ${muralOffset(index)}`}
            >
              <span
                aria-hidden
                className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-1 bg-mural-tape/85"
              />
              <div className="relative aspect-video overflow-hidden bg-mural-bg">
                {post.coverImageUrl && (
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover grayscale-[15%] transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                {post.category && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1.5 bg-mural-paper/95 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-mural-pin">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-mural-pin" />
                    {post.category.name}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col pt-4">
                {post.publishedAt && (
                  <p className="text-xs font-bold uppercase tracking-wide text-mural-ink/40">
                    {post.publishedAt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                )}
                <h3 className="mt-1.5 font-display font-black uppercase leading-tight text-mural-ink transition-colors group-hover:text-mural-pin">
                  {post.title}
                </h3>
                {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-mural-ink/60">{post.excerpt}</p>}
                <span
                  aria-hidden
                  className="mt-auto inline-flex w-fit items-center gap-1 pt-3 text-xs font-bold uppercase tracking-wide text-mural-ink/40 transition-all group-hover:gap-2 group-hover:text-mural-pin"
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
