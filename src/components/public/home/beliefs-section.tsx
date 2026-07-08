import { prisma } from '@/lib/prisma';
import { SectionHeading } from '@/components/public/section-heading';

export async function BeliefsSection() {
  const beliefs = await prisma.beliefValue.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });
  if (beliefs.length === 0) return null;

  return (
    <section className="bg-slate-50 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Valores" title="No que acredito" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {beliefs.map((belief) => (
            <div
              key={belief.id}
              className="border-2 border-slate-900 bg-white p-6 shadow-hard-sm transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard sm:p-8"
            >
              {belief.icon && (
                <span
                  aria-hidden
                  className="flex h-11 w-11 items-center justify-center border-2 border-slate-900 bg-accent text-xl"
                >
                  {belief.icon}
                </span>
              )}
              <h3 className={`font-display text-xl font-black uppercase leading-tight text-slate-900 ${belief.icon ? 'mt-4' : ''}`}>
                {belief.title}
              </h3>
              <p className="mt-2 text-slate-600">{belief.tagline}</p>
              {belief.description && <p className="mt-3 text-sm leading-relaxed text-slate-500">{belief.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
