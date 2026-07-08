import Image from 'next/image';
import { FaInstagram } from 'react-icons/fa6';
import { prisma } from '@/lib/prisma';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { SectionHeading } from '@/components/public/section-heading';

/**
 * Posts com leve rotação alternada, como fotos coladas — a mesma
 * linguagem dos "carimbos" rotacionados do restante do site. No hover
 * (e em telas pequenas) o card endireita.
 */
export async function InstagramSection() {
  const [highlights, settings] = await Promise.all([
    prisma.instagramHighlight.findMany({ orderBy: { order: 'asc' }, take: 3 }),
    getCachedSiteSettings(),
  ]);
  if (highlights.length === 0) return null;

  return (
    <section className="overflow-hidden bg-slate-50 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Redes sociais"
          title="Instagram"
          ctaLabel={settings.instagramUrl ? 'Seguir no Instagram' : undefined}
          ctaHref={settings.instagramUrl}
          ctaExternal
        />
        <div className="grid gap-6 sm:grid-cols-3 sm:gap-8">
          {highlights.map((post, index) => (
            <a
              key={post.id}
              href={post.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`group block overflow-hidden border-2 border-slate-900 bg-white shadow-hard-sm transition-all hover:-translate-y-1 hover:rotate-0 hover:shadow-hard motion-reduce:transform-none ${
                index % 2 === 0 ? 'sm:-rotate-1' : 'sm:rotate-1'
              }`}
            >
              <div className="relative aspect-square overflow-hidden border-b-2 border-slate-900 bg-slate-100">
                <Image
                  src={post.imageUrl}
                  alt={post.caption ?? 'Post do Instagram'}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span
                  aria-hidden
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center border-2 border-slate-900 bg-white text-primary"
                >
                  <FaInstagram size={15} />
                </span>
              </div>
              {post.caption && <p className="line-clamp-2 p-3 text-sm text-slate-600">{post.caption}</p>}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
