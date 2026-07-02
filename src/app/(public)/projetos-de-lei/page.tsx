import Link from 'next/link';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = { title: 'Projetos de Lei' };

const STATUS_LABEL: Record<string, string> = {
  APRESENTADO: 'Apresentado',
  EM_TRAMITACAO: 'Em tramitação',
  APROVADO: 'Aprovado',
  REJEITADO: 'Rejeitado',
  ARQUIVADO: 'Arquivado',
};

export default async function ProjetosDeLeiPage() {
  const projetos = await prisma.projetoDeLei.findMany({
    where: { publishStatus: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Projetos de Lei</h1>

      {projetos.length === 0 ? (
        <p className="mt-10 text-slate-500">Nenhum projeto de lei publicado ainda.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {projetos.map((pl) => (
            <Link
              key={pl.id}
              href={`/projetos-de-lei/${pl.slug}`}
              className="block rounded-xl border border-slate-200 p-5 transition-colors hover:border-primary"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">PL {pl.number}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  {STATUS_LABEL[pl.status] ?? pl.status}
                </span>
              </div>
              <h2 className="mt-2 font-semibold text-slate-900">{pl.title}</h2>
              {pl.summary && <p className="mt-2 line-clamp-3 text-sm text-slate-600">{pl.summary}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
