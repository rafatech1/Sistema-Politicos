import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { SectionHeading } from '@/components/public/section-heading';

interface HighlightCardData {
  id: string;
  href: string;
  eyebrow: string | null;
  title: string;
  summary: string | null;
}

/**
 * O 1º item (isFeatured desc) vira um card escuro grande à esquerda;
 * os demais ficam empilhados à direita. A hierarquia visual espelha a
 * hierarquia real dos dados (destaque marcado no admin vem primeiro).
 */
function HighlightsGrid({ items }: { items: HighlightCardData[] }) {
  const [featured, ...rest] = items;
  if (!featured) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Link
        href={featured.href}
        className={`group relative flex flex-col justify-between overflow-hidden border-2 border-slate-900 bg-slate-900 p-8 text-white shadow-hard-sm transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard sm:p-10 ${
          rest.length > 0 ? 'sm:row-span-2' : 'sm:col-span-2'
        }`}
      >
        <span aria-hidden className="absolute inset-x-0 top-0 h-2 bg-accent" />
        <div>
          {featured.eyebrow && (
            <span className="font-mono text-xs font-bold uppercase tracking-wide tabular-nums text-accent">
              {featured.eyebrow}
            </span>
          )}
          <h3 className="mt-3 font-display text-2xl font-black uppercase leading-tight sm:text-3xl">
            {featured.title}
          </h3>
          {featured.summary && <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-white/70">{featured.summary}</p>}
        </div>
        <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-accent">
          Ler na íntegra
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      </Link>

      {rest.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="group flex overflow-hidden border-2 border-slate-900 bg-white shadow-hard-sm transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard"
        >
          <span aria-hidden className="w-2 shrink-0 bg-primary transition-colors group-hover:bg-accent" />
          <div className="flex flex-col justify-center p-6">
            {item.eyebrow && (
              <span className="font-mono text-xs font-bold uppercase tracking-wide tabular-nums text-primary">
                {item.eyebrow}
              </span>
            )}
            <h3 className="mt-2 font-display font-black uppercase leading-tight text-slate-900">{item.title}</h3>
            {item.summary && <p className="mt-2 line-clamp-3 text-sm text-slate-600">{item.summary}</p>}
          </div>
        </Link>
      ))}
    </div>
  );
}

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
          <HighlightsGrid
            items={items.map((pl) => ({
              id: pl.id,
              href: `/projetos-de-lei/${pl.slug}`,
              eyebrow: `PL ${pl.number}`,
              title: pl.title,
              summary: pl.summary,
            }))}
          />
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
        <HighlightsGrid
          items={propostas.map((proposta) => ({
            id: proposta.id,
            href: `/propostas/${proposta.slug}`,
            eyebrow: proposta.eixoTematico?.name ?? null,
            title: proposta.title,
            summary: proposta.summary,
          }))}
        />
      </div>
    </section>
  );
}
