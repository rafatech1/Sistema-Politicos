import { prisma } from '@/lib/prisma';
import { SectionHeading } from '@/components/public/section-heading';
import { AgendaCarousel } from '@/components/public/home/agenda-carousel';

export async function AgendaSection() {
  const eventos = await prisma.evento.findMany({
    where: { isPublic: true, startAt: { gte: new Date() }, status: { not: 'CANCELLED' } },
    orderBy: { startAt: 'asc' },
    take: 8,
  });
  if (eventos.length === 0) return null;

  return (
    <section className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Agenda" title="Próximos eventos" ctaLabel="Ver agenda completa" ctaHref="/agenda" />
        <AgendaCarousel
          eventos={eventos.map((evento) => ({
            id: evento.id,
            slug: evento.slug,
            title: evento.title,
            location: evento.location,
            startAtIso: evento.startAt.toISOString(),
          }))}
        />
      </div>
    </section>
  );
}
