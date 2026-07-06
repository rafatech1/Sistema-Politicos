import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { SectionHeading } from '@/components/public/section-heading';

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
      <section className="bg-slate-50 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Atuação" title="Projetos de Lei" ctaLabel="Ver todos" ctaHref="/projetos-de-lei" />
          <div className="grid gap-6 sm:grid-cols-3">
            {items.map((pl) => (
              <Link
                key={pl.id}
                href={`/projetos-de-lei/${pl.slug}`}
                className="group flex overflow-hidden border-2 border-slate-900 bg-white shadow-hard-sm transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard"
              >
                <span aria-hidden className="w-2 shrink-0 bg-primary transition-colors group-hover:bg-accent" />
                <div className="p-6">
                  <span className="font-mono text-xs font-bold uppercase tracking-wide tabular-nums text-primary">
                    PL {pl.number}
                  </span>
                  <h3 className="mt-2 font-display font-black uppercase leading-tight text-slate-900">{pl.title}</h3>
                  {pl.summary && <p className="mt-2 line-clamp-3 text-sm text-slate-600">{pl.summary}</p>}
                </div>
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
    <section className="bg-slate-50 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Atuação" title="Propostas" ctaLabel="Ver todas" ctaHref="/propostas" />
        <div className="grid gap-6 sm:grid-cols-3">
          {propostas.map((proposta) => (
            <Link
              key={proposta.id}
              href={`/propostas/${proposta.slug}`}
              className="group flex overflow-hidden border-2 border-slate-900 bg-white shadow-hard-sm transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard"
            >
              <span aria-hidden className="w-2 shrink-0 bg-primary transition-colors group-hover:bg-accent" />
              <div className="p-6">
                {proposta.eixoTematico && (
                  <span className="text-xs font-bold uppercase tracking-wide text-primary">
                    {proposta.eixoTematico.name}
                  </span>
                )}
                <h3 className="mt-2 font-display font-black uppercase leading-tight text-slate-900">{proposta.title}</h3>
                {proposta.summary && <p className="mt-2 line-clamp-3 text-sm text-slate-600">{proposta.summary}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
