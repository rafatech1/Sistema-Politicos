import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { sanitizeRichText } from '@/lib/utils/sanitize-html';

const STATUS_LABEL: Record<string, string> = {
  APRESENTADO: 'Apresentado',
  EM_TRAMITACAO: 'Em tramitação',
  APROVADO: 'Aprovado',
  REJEITADO: 'Rejeitado',
  ARQUIVADO: 'Arquivado',
};

async function getProjetoDeLei(slug: string) {
  const pl = await prisma.projetoDeLei.findUnique({ where: { slug } });
  if (!pl || pl.publishStatus !== 'PUBLISHED') return null;
  return pl;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const pl = await getProjetoDeLei(params.slug);
  if (!pl) return {};
  return {
    title: `PL ${pl.number} — ${pl.title}`,
    description: pl.summary ?? undefined,
    openGraph: {
      title: `PL ${pl.number} — ${pl.title}`,
      description: pl.summary ?? undefined,
      images: pl.coverImageUrl ? [{ url: pl.coverImageUrl }] : undefined,
    },
  };
}

export default async function ProjetoDeLeiPage({ params }: { params: { slug: string } }) {
  const pl = await getProjetoDeLei(params.slug);
  if (!pl) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">PL {pl.number}</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
          {STATUS_LABEL[pl.status] ?? pl.status}
        </span>
      </div>
      <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{pl.title}</h1>
      {pl.summary && <p className="mt-4 text-lg text-slate-600">{pl.summary}</p>}

      <div
        className="prose prose-slate mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizeRichText(pl.content) }}
      />

      {pl.externalUrl && (
        <a
          href={pl.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block text-sm font-semibold text-primary hover:underline"
        >
          Acompanhar tramitação na Casa Legislativa →
        </a>
      )}
    </article>
  );
}
