import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { SectionHeading } from '@/components/public/section-heading';

export const metadata: Metadata = { title: 'Agenda' };

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(date);
}

function EventCard({ evento }: { evento: { slug: string; title: string; startAt: Date; location: string | null; coverImageUrl: string | null; status: string } }) {
  return (
    <Link
      href={`/agenda/${evento.slug}`}
      className="group flex overflow-hidden border-2 border-slate-900 bg-white shadow-hard-sm transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard"
    >
      <span
        aria-hidden
        className={`w-2 shrink-0 ${evento.status === 'CANCELLED' ? 'bg-red-600' : 'bg-primary'} transition-colors group-hover:bg-accent`}
      />
      <div className="flex flex-1 gap-4 p-5">
        {evento.coverImageUrl && (
          <div className="relative hidden aspect-square w-20 shrink-0 overflow-hidden border-2 border-slate-900 bg-slate-100 sm:block">
            <Image src={evento.coverImageUrl} alt={evento.title} fill className="object-cover" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            {formatDateTime(evento.startAt)}
            {evento.status === 'CANCELLED' && <span className="ml-2 text-red-600">· Cancelado</span>}
          </p>
          <h2 className="mt-1 font-display font-black uppercase leading-tight text-slate-900">{evento.title}</h2>
          {evento.location && <p className="mt-1 text-sm text-slate-600">{evento.location}</p>}
        </div>
      </div>
    </Link>
  );
}

export default async function AgendaPage() {
  const now = new Date();

  const [upcoming, past] = await Promise.all([
    prisma.evento.findMany({
      where: { isPublic: true, startAt: { gte: now } },
      orderBy: { startAt: 'asc' },
    }),
    prisma.evento.findMany({
      where: { isPublic: true, startAt: { lt: now } },
      orderBy: { startAt: 'desc' },
      take: 12,
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <SectionHeading as="h1" eyebrow="Agenda" title="Próximos eventos" />

      {upcoming.length === 0 ? (
        <p className="text-slate-500">Nenhum evento agendado no momento.</p>
      ) : (
        <div className="space-y-4">
          {upcoming.map((evento) => (
            <EventCard key={evento.id} evento={evento} />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-black uppercase text-slate-900">Eventos anteriores</h2>
          <div className="mt-6 space-y-4">
            {past.map((evento) => (
              <EventCard key={evento.id} evento={evento} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
