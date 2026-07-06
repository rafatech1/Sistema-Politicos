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
        <span className="mb-3 inline-block -rotate-1 border-2 border-slate-900 bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-slate-900">
          {proposta.eixoTematico.name}
        </span>
      )}
      <h1 className="font-display text-3xl font-black uppercase leading-[0.95] text-slate-900 sm:text-4xl">
        {proposta.title}
      </h1>
      {proposta.summary && <p className="mt-4 text-lg text-slate-600">{proposta.summary}</p>}

      <div
        className="prose prose-slate mt-8 max-w-none prose-headings:font-display prose-headings:font-black prose-headings:uppercase prose-a:font-bold prose-a:text-primary"
        dangerouslySetInnerHTML={{ __html: sanitizeRichText(proposta.content) }}
      />
    </article>
  );
}
