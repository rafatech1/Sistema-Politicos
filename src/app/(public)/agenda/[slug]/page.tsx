import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(date);
}

async function getEvento(slug: string) {
  const evento = await prisma.evento.findUnique({ where: { slug } });
  if (!evento || !evento.isPublic) return null;
  return evento;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const evento = await getEvento(params.slug);
  if (!evento) return {};

  return {
    title: evento.title,
    description: evento.description ?? undefined,
    openGraph: {
      title: evento.title,
      description: evento.description ?? undefined,
      images: evento.coverImageUrl ? [{ url: evento.coverImageUrl }] : undefined,
      type: 'website',
    },
  };
}

export default async function EventoPage({ params }: { params: { slug: string } }) {
  const evento = await getEvento(params.slug);
  if (!evento) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <span
        className={`mb-3 inline-block -rotate-1 border-2 border-slate-900 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-slate-900 ${
          evento.status === 'CANCELLED' ? 'bg-red-100' : 'bg-accent'
        }`}
      >
        {evento.status === 'CANCELLED' ? 'Cancelado' : 'Agenda'}
      </span>
      <h1 className="font-display text-3xl font-black uppercase leading-[0.95] text-slate-900 sm:text-4xl">
        {evento.title}
      </h1>
      <p className="mt-3 text-sm font-bold uppercase tracking-wide text-primary">
        {formatDateTime(evento.startAt)}
        {evento.endAt && ` — ${formatDateTime(evento.endAt)}`}
      </p>
      {(evento.location || evento.address) && (
        <p className="mt-1 text-sm text-slate-600">
          {evento.location}
          {evento.location && evento.address ? ' · ' : ''}
          {evento.address}
        </p>
      )}

      {evento.coverImageUrl && (
        <div className="relative mt-8 aspect-video overflow-hidden border-4 border-slate-900 bg-slate-100 shadow-hard">
          <Image src={evento.coverImageUrl} alt={evento.title} fill className="object-cover" />
        </div>
      )}

      {evento.description && (
        <p className="mt-8 whitespace-pre-line leading-relaxed text-slate-700">{evento.description}</p>
      )}
    </article>
  );
}
