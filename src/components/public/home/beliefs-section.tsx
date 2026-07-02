import { prisma } from '@/lib/prisma';
import { SectionHeading } from './section-heading';

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
        <div className="grid gap-6 sm:grid-cols-2">
          {beliefs.map((belief, index) => (
            <div
              key={belief.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover sm:p-8"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-semibold text-primary">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-slate-900">{belief.title}</h3>
              <p className="mt-2 text-slate-600">{belief.tagline}</p>
              {belief.description && <p className="mt-3 text-sm leading-relaxed text-slate-500">{belief.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
