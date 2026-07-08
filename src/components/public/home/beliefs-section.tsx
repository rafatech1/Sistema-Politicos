import { prisma } from '@/lib/prisma';
import { SectionHeading } from '@/components/public/section-heading';

export async function BeliefsSection() {
  const beliefs = await prisma.beliefValue.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });
  if (beliefs.length === 0) return null;

  return (
    <section className="bg-editorial-bg px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Valores" title="No que acredito" variant="editorial" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {beliefs.map((belief) => (
            <div
              key={belief.id}
              className="rounded-2xl bg-editorial-card p-6 shadow-[0_8px_24px_-10px_rgba(36,40,32,0.18)] transition-shadow hover:shadow-[0_12px_28px_-10px_rgba(36,40,32,0.26)] sm:p-7"
            >
              {belief.icon && (
                <span
                  aria-hidden
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-editorial-bg text-xl shadow-sm"
                >
                  {belief.icon}
                </span>
              )}
              <h3 className={`font-serif text-xl font-medium leading-tight text-editorial-ink ${belief.icon ? 'mt-4' : ''}`}>
                {belief.title}
              </h3>
              <p className="mt-2 text-sm text-editorial-ink/70">{belief.tagline}</p>
              {belief.description && (
                <p className="mt-3 text-sm leading-relaxed text-editorial-muted">{belief.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
