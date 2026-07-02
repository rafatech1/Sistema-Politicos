import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { sanitizeRichText } from '@/lib/utils/sanitize-html';

async function getProposta(slug: string) {
  const proposta = await prisma.proposta.findUnique({ where: { slug }, include: { eixoTematico: true } });
  if (!proposta || proposta.status !== 'PUBLISHED') return null;
  return proposta;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const proposta = await getProposta(params.slug);
  if (!proposta) return {};
  return {
    title: proposta.title,
    description: proposta.summary ?? undefined,
    openGraph: {
      title: proposta.title,
      description: proposta.summary ?? undefined,
      images: proposta.coverImageUrl ? [{ url: proposta.coverImageUrl }] : undefined,
    },
  };
}

export default async function PropostaPage({ params }: { params: { slug: string } }) {
  const proposta = await getProposta(params.slug);
  if (!proposta) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      {proposta.eixoTematico && (
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
          {proposta.eixoTematico.name}
        </span>
      )}
      <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{proposta.title}</h1>
      {proposta.summary && <p className="mt-4 text-lg text-slate-600">{proposta.summary}</p>}

      <div
        className="prose prose-slate mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizeRichText(proposta.content) }}
      />
    </article>
  );
}
