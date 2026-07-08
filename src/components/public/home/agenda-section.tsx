import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { SectionHeading } from '@/components/public/section-heading';
import { muralOffset, muralRotation } from '@/lib/mural';

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
    <section className="bg-mural-bg px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Agenda"
          title="Próximos eventos"
          ctaLabel="Ver agenda completa"
          ctaHref="/agenda"
          variant="mural"
        />
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {eventos.map((evento, index) => (
            <Link
              key={evento.id}
              href={`/agenda/${evento.slug}`}
              className={`group relative flex overflow-hidden bg-mural-paper shadow-[0_10px_28px_-12px_rgba(22,35,63,0.35)] transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_16px_36px_-12px_rgba(22,35,63,0.4)] ${muralRotation(index)} ${muralOffset(index)}`}
            >
              <span
                aria-hidden
                className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-1 bg-mural-tape/85"
              />
              <div className="flex w-20 shrink-0 flex-col items-center justify-center gap-0.5 border-r border-dashed border-mural-ink/30 bg-mural-ink py-6 text-mural-paper transition-colors group-hover:bg-mural-pin">
                <span className="font-display text-3xl font-black leading-none">{formatDay(evento.startAt)}</span>
                <span className="text-[11px] font-bold uppercase tracking-widest">{formatMonthAbbr(evento.startAt)}</span>
              </div>
              <div className="flex flex-1 flex-col justify-center p-5">
                <span className="text-xs font-bold uppercase tracking-wide text-mural-pin">
                  {formatWeekdayTime(evento.startAt)}
                </span>
                <h3 className="mt-1.5 font-display font-black uppercase leading-tight text-mural-ink">
                  {evento.title}
                </h3>
                {evento.location && <p className="mt-2 line-clamp-1 text-sm text-mural-ink/60">{evento.location}</p>}
                <span
                  aria-hidden
                  className="mt-3 inline-flex w-fit items-center gap-1 text-xs font-bold uppercase tracking-wide text-mural-ink/40 transition-all group-hover:gap-2 group-hover:text-mural-pin"
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
