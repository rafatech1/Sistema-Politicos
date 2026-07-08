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
    <section className="bg-editorial-bg px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Agenda"
          title="Próximos eventos"
          ctaLabel="Ver agenda completa"
          ctaHref="/agenda"
          variant="editorial"
        />
        <div className="grid gap-6 sm:grid-cols-3">
          {eventos.map((evento) => (
            <Link
              key={evento.id}
              href={`/agenda/${evento.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-editorial-card p-6 pl-7 shadow-[0_8px_24px_-10px_rgba(36,40,32,0.18)] transition-shadow hover:shadow-[0_12px_28px_-10px_rgba(36,40,32,0.26)]"
            >
              <span
                aria-hidden
                className="absolute bottom-4 left-3 top-4 w-1 rounded-full bg-editorial-accent"
              />
              <span className="font-mono text-xs text-editorial-accent-soft">{formatDateTime(evento.startAt)}</span>
              <h3 className="mt-2 font-serif text-lg font-medium leading-snug text-editorial-ink">{evento.title}</h3>
              {evento.location && (
                <p className="mt-3 flex items-center gap-1.5 text-sm text-editorial-muted">
                  <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11Z" strokeLinejoin="round" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  {evento.location}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
