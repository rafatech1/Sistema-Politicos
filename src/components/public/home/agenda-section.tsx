import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { SectionHeading } from '@/components/public/section-heading';

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(date);
}

export async function AgendaSection() {
  const eventos = await prisma.evento.findMany({
    where: { isPublic: true, startAt: { gte: new Date() }, status: { not: 'CANCELLED' } },
    orderBy: { startAt: 'asc' },
    take: 3,
  });
  if (eventos.length === 0) return null;

  return (
    <section className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Agenda" title="Próximos eventos" ctaLabel="Ver agenda completa" ctaHref="/agenda" />
        <div className="grid gap-6 sm:grid-cols-3">
          {eventos.map((evento) => (
            <Link
              key={evento.id}
              href={`/agenda/${evento.slug}`}
              className="group flex overflow-hidden border-2 border-slate-900 bg-white shadow-hard-sm transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard"
            >
              <span aria-hidden className="w-2 shrink-0 bg-primary transition-colors group-hover:bg-accent" />
              <div className="p-6">
                <span className="text-xs font-bold uppercase tracking-wide text-primary">
                  {formatDateTime(evento.startAt)}
                </span>
                <h3 className="mt-2 font-display font-black uppercase leading-tight text-slate-900">
                  {evento.title}
                </h3>
                {evento.location && <p className="mt-2 text-sm text-slate-600">{evento.location}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
