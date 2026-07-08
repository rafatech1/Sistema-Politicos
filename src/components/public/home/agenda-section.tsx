import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { SectionHeading } from '@/components/public/section-heading';

// Fuso fixo para o horário renderizado no servidor não depender do TZ do host.
// Ajuste por cliente se necessário (produto é deploy por contrato).
const TIMEZONE = 'America/Sao_Paulo';

function getDateParts(date: Date) {
  const day = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', timeZone: TIMEZONE }).format(date);
  const month = new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: TIMEZONE })
    .format(date)
    .replace('.', '');
  const time = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: TIMEZONE }).format(
    date,
  );
  return { day, month, time };
}

/**
 * Agenda como lista de compromissos com bloco de data — o dia é o dado
 * mais importante de um evento, então ele vira a âncora visual.
 */
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

        <ol className="border-2 border-slate-900 bg-white shadow-hard-sm">
          {eventos.map((evento) => {
            const { day, month, time } = getDateParts(evento.startAt);
            return (
              <li key={evento.id} className="border-b-2 border-slate-900 last:border-b-0">
                <Link
                  href={`/agenda/${evento.slug}`}
                  className="group flex items-center gap-5 p-5 transition-colors hover:bg-slate-50 sm:gap-8 sm:p-6"
                >
                  <div className="flex w-16 shrink-0 flex-col items-center border-2 border-slate-900 bg-accent py-2 text-slate-900 sm:w-20 sm:py-3">
                    <span className="font-display text-2xl font-black leading-none tabular-nums sm:text-3xl">
                      {day}
                    </span>
                    <span className="mt-1 text-[10px] font-bold uppercase tracking-widest sm:text-xs">{month}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wide text-primary">{time}</p>
                    <h3 className="mt-1 font-display text-lg font-black uppercase leading-tight text-slate-900 transition-colors group-hover:text-primary sm:text-xl">
                      {evento.title}
                    </h3>
                    {evento.location && <p className="mt-1 truncate text-sm text-slate-600">{evento.location}</p>}
                  </div>

                  <span
                    aria-hidden
                    className="hidden shrink-0 text-2xl text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-primary sm:block"
                  >
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
