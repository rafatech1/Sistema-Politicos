import { prisma } from '@/lib/prisma';
import { SectionHeading } from '@/components/public/section-heading';
import { muralOffset, muralRotation } from '@/lib/mural';

export async function BeliefsSection() {
  const beliefs = await prisma.beliefValue.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });
  if (beliefs.length === 0) return null;

  return (
    <section className="bg-mural-bg px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Valores" title="No que acredito" variant="mural" />
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2">
          {beliefs.map((belief, index) => (
            <div
              key={belief.id}
              className={`group relative bg-mural-paper p-6 shadow-[0_10px_28px_-12px_rgba(22,35,63,0.35)] transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_16px_36px_-12px_rgba(22,35,63,0.4)] sm:p-8 ${muralRotation(index)} ${muralOffset(index)}`}
            >
              <span
                aria-hidden
                className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-1 bg-mural-tape/85"
              />
              {belief.icon && (
                <span
                  aria-hidden
                  className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-mural-ink/40 bg-mural-bg text-2xl transition-transform duration-300 group-hover:-rotate-6"
                >
                  {belief.icon}
                </span>
              )}
              <h3 className={`font-display text-xl font-black uppercase leading-tight text-mural-ink ${belief.icon ? 'mt-5' : ''}`}>
                {belief.title}
              </h3>
              <p className="mt-2 text-mural-ink/70">{belief.tagline}</p>
              {belief.description && (
                <p className="mt-3 text-sm leading-relaxed text-mural-ink/50">{belief.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
