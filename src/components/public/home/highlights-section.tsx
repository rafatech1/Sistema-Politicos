import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { SectionHeading } from './section-heading';

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
                className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">PL {pl.number}</span>
                <h3 className="mt-2 font-semibold text-slate-900">{pl.title}</h3>
                {pl.summary && <p className="mt-2 line-clamp-3 text-sm text-slate-600">{pl.summary}</p>}
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
              className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              {proposta.eixoTematico && (
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {proposta.eixoTematico.name}
                </span>
              )}
              <h3 className="mt-2 font-semibold text-slate-900">{proposta.title}</h3>
              {proposta.summary && <p className="mt-2 line-clamp-3 text-sm text-slate-600">{proposta.summary}</p>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
