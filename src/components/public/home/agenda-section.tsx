import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { SectionHeading } from '@/components/public/section-heading';

function formatDay(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit' }).format(date);
}

function formatMonthAbbr(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date).replace('.', '').toUpperCase();
}

function formatWeekdayTime(date: Date) {
  const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(date).replace('.', '');
  const time = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(date);
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} · ${time}`;
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {eventos.map((evento) => (
            <Link
              key={evento.id}
              href={`/agenda/${evento.slug}`}
              className="group flex overflow-hidden border-2 border-slate-900 bg-white shadow-hard-sm transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard"
            >
              <div className="flex w-20 shrink-0 flex-col items-center justify-center gap-0.5 border-r-2 border-dashed border-slate-900 bg-primary py-6 text-white transition-colors group-hover:bg-accent group-hover:text-slate-900">
                <span className="font-display text-3xl font-black leading-none">{formatDay(evento.startAt)}</span>
                <span className="text-[11px] font-bold uppercase tracking-widest">{formatMonthAbbr(evento.startAt)}</span>
              </div>
              <div className="flex flex-1 flex-col justify-center p-5">
                <span className="text-xs font-bold uppercase tracking-wide text-primary">
                  {formatWeekdayTime(evento.startAt)}
                </span>
                <h3 className="mt-1.5 font-display font-black uppercase leading-tight text-slate-900">
                  {evento.title}
                </h3>
                {evento.location && <p className="mt-2 line-clamp-1 text-sm text-slate-600">{evento.location}</p>}
                <span
                  aria-hidden
                  className="mt-3 inline-flex w-fit items-center gap-1 text-xs font-bold uppercase tracking-wide text-slate-400 transition-all group-hover:gap-2 group-hover:text-primary"
                >
                  Ver detalhes <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
