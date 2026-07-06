import Link from 'next/link';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { SectionHeading } from '@/components/public/section-heading';

export const metadata: Metadata = { title: 'Propostas' };

export default async function PropostasPage({
  searchParams,
}: {
  searchParams: { eixo?: string };
}) {
  const [eixos, propostas] = await Promise.all([
    prisma.eixoTematico.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
    prisma.proposta.findMany({
      where: {
        status: 'PUBLISHED',
        eixoTematico: searchParams.eixo ? { slug: searchParams.eixo } : undefined,
      },
      orderBy: { order: 'asc' },
      include: { eixoTematico: true },
    }),
  ]);

  const filterClassName = (active: boolean) =>
    `border-2 border-slate-900 px-4 py-1.5 text-sm font-bold uppercase tracking-wide transition-all ${
      active ? 'bg-accent text-slate-900' : 'bg-white text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeading as="h1" eyebrow="Atuação" title="Propostas" />

      {eixos.length > 0 && (
        <div className="-mt-4 mb-10 flex flex-wrap gap-2">
          <Link href="/propostas" className={filterClassName(!searchParams.eixo)}>
            Todos os eixos
          </Link>
          {eixos.map((eixo) => (
            <Link
              key={eixo.id}
              href={`/propostas?eixo=${eixo.slug}`}
              className={filterClassName(searchParams.eixo === eixo.slug)}
            >
              {eixo.name}
            </Link>
          ))}
        </div>
      )}

      {propostas.length === 0 ? (
        <p className="text-slate-500">Nenhuma proposta publicada ainda.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-3">
          {propostas.map((proposta) => (
            <Link
              key={proposta.id}
              href={`/propostas/${proposta.slug}`}
              className="group flex overflow-hidden border-2 border-slate-900 bg-white shadow-hard-sm transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard"
            >
              <span aria-hidden className="w-2 shrink-0 bg-primary transition-colors group-hover:bg-accent" />
              <div className="p-5">
                {proposta.eixoTematico && (
                  <span className="text-xs font-bold uppercase tracking-wide text-primary">
                    {proposta.eixoTematico.name}
                  </span>
                )}
                <h2 className="mt-2 font-display font-black uppercase leading-tight text-slate-900">
                  {proposta.title}
                </h2>
                {proposta.summary && <p className="mt-2 line-clamp-3 text-sm text-slate-600">{proposta.summary}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
