import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { SectionHeading } from '@/components/public/section-heading';
import { muralOffset, muralRotation } from '@/lib/mural';

export async function HighlightsSection() {
  const settings = await getCachedSiteSettings();

  if (settings.mode === 'MANDATE') {
    const items = await prisma.projetoDeLei.findMany({
      where: { publishStatus: 'PUBLISHED' },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      take: 3,
    });
    if (items.length === 0) return null;

    return (
      <section className="bg-mural-bg px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Atuação"
            title="Projetos de Lei"
            ctaLabel="Ver todos"
            ctaHref="/projetos-de-lei"
            variant="mural"
          />
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((pl, index) => (
              <Link
                key={pl.id}
                href={`/projetos-de-lei/${pl.slug}`}
                className={`group relative flex flex-col overflow-hidden bg-mural-paper p-6 shadow-[0_10px_28px_-12px_rgba(22,35,63,0.35)] transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_16px_36px_-12px_rgba(22,35,63,0.4)] ${muralRotation(index)} ${muralOffset(index)}`}
              >
                <span
                  aria-hidden
                  className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-1 bg-mural-tape/85"
                />
                <span className="mb-2 inline-flex w-fit items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wide tabular-nums text-mural-pin">
                  <span aria-hidden className="h-2 w-2 rounded-full bg-mural-pin" />
                  PL {pl.number}
                </span>
                <h3 className="font-display font-black uppercase leading-tight text-mural-ink">{pl.title}</h3>
                {pl.summary && <p className="mt-2 line-clamp-3 text-sm text-mural-ink/60">{pl.summary}</p>}
                <span
                  aria-hidden
                  className="mt-auto inline-flex w-fit items-center gap-1 pt-3 text-xs font-bold uppercase tracking-wide text-mural-ink/40 transition-all group-hover:gap-2 group-hover:text-mural-pin"
                >
                  Ver projeto <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const propostas = await prisma.proposta.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
    take: 3,
    include: { eixoTematico: true },
  });
  if (propostas.length === 0) return null;

  return (
    <section className="bg-mural-bg px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Atuação" title="Propostas" ctaLabel="Ver todas" ctaHref="/propostas" variant="mural" />
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {propostas.map((proposta, index) => (
            <Link
              key={proposta.id}
              href={`/propostas/${proposta.slug}`}
              className={`group relative flex flex-col overflow-hidden bg-mural-paper p-6 shadow-[0_10px_28px_-12px_rgba(22,35,63,0.35)] transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_16px_36px_-12px_rgba(22,35,63,0.4)] ${muralRotation(index)} ${muralOffset(index)}`}
            >
              <span
                aria-hidden
                className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-1 bg-mural-tape/85"
              />
              {proposta.eixoTematico && (
                <span className="mb-2 inline-flex w-fit items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-mural-pin">
                  <span aria-hidden className="h-2 w-2 rounded-full bg-mural-pin" />
                  {proposta.eixoTematico.name}
                </span>
              )}
              <h3 className="font-display font-black uppercase leading-tight text-mural-ink">{proposta.title}</h3>
              {proposta.summary && <p className="mt-2 line-clamp-3 text-sm text-mural-ink/60">{proposta.summary}</p>}
              <span
                aria-hidden
                className="mt-auto inline-flex w-fit items-center gap-1 pt-3 text-xs font-bold uppercase tracking-wide text-mural-ink/40 transition-all group-hover:gap-2 group-hover:text-mural-pin"
              >
                Ver proposta <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
