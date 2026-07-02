import Link from 'next/link';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

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

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Propostas</h1>

      {eixos.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/propostas"
            className={`rounded-full border px-4 py-1.5 text-sm ${
              !searchParams.eixo ? 'border-primary bg-primary text-white' : 'border-slate-200 text-slate-600'
            }`}
          >
            Todos os eixos
          </Link>
          {eixos.map((eixo) => (
            <Link
              key={eixo.id}
              href={`/propostas?eixo=${eixo.slug}`}
              className={`rounded-full border px-4 py-1.5 text-sm ${
                searchParams.eixo === eixo.slug
                  ? 'border-primary bg-primary text-white'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              {eixo.name}
            </Link>
          ))}
        </div>
      )}

      {propostas.length === 0 ? (
        <p className="mt-10 text-slate-500">Nenhuma proposta publicada ainda.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {propostas.map((proposta) => (
            <Link
              key={proposta.id}
              href={`/propostas/${proposta.slug}`}
              className="block rounded-xl border border-slate-200 p-5 transition-colors hover:border-primary"
            >
              {proposta.eixoTematico && (
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {proposta.eixoTematico.name}
                </span>
              )}
              <h2 className="mt-2 font-semibold text-slate-900">{proposta.title}</h2>
              {proposta.summary && <p className="mt-2 line-clamp-3 text-sm text-slate-600">{proposta.summary}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
