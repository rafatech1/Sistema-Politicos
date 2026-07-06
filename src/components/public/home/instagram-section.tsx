import Image from 'next/image';
import { FaInstagram } from 'react-icons/fa6';
import { prisma } from '@/lib/prisma';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { SectionHeading } from './section-heading';

export async function InstagramSection() {
  const [highlights, settings] = await Promise.all([
    prisma.instagramHighlight.findMany({ orderBy: { order: 'asc' }, take: 3 }),
    getCachedSiteSettings(),
  ]);
  if (highlights.length === 0) return null;

  return (
    <section className="bg-slate-50 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Redes sociais"
          title="Instagram"
          ctaLabel={settings.instagramUrl ? 'Seguir no Instagram' : undefined}
          ctaHref={settings.instagramUrl}
          ctaExternal
        />
        <div className="grid gap-6 sm:grid-cols-3">
          {highlights.map((post) => (
            <a
              key={post.id}
              href={post.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <Image
                  src={post.imageUrl}
                  alt={post.caption ?? 'Post do Instagram'}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span
                  aria-hidden
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-primary shadow-card"
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
