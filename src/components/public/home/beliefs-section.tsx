import { prisma } from '@/lib/prisma';
import { SectionHeading } from '@/components/public/section-heading';

/**
 * "No que acredito" como manifesto numerado, não como grid de cards.
 * Os valores têm campo `order` — a numeração 01/02/03 reflete uma
 * ordenação real definida no admin, não é decoração.
 */
export async function BeliefsSection() {
  const beliefs = await prisma.beliefValue.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });
  if (beliefs.length === 0) return null;

  return (
    <section className="bg-slate-50 px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-[280px_1fr] sm:gap-16">
        <div className="sm:sticky sm:top-24 sm:self-start">
          <SectionHeading eyebrow="Valores" title="No que acredito" />
        </div>

        <ol className="border-y-2 border-slate-900">
          {beliefs.map((belief, index) => (
            <li
              key={belief.id}
              className="group grid gap-2 border-b-2 border-slate-900 py-7 last:border-b-0 sm:grid-cols-[96px_1fr] sm:gap-6 sm:py-9"
            >
              <span
                aria-hidden
                className="font-display text-4xl font-black leading-none tabular-nums text-slate-300 transition-colors group-hover:text-primary sm:text-5xl"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="flex items-center gap-3 font-display text-xl font-black uppercase leading-tight text-slate-900 sm:text-2xl">
                  {belief.icon && <span aria-hidden>{belief.icon}</span>}
                  {belief.title}
                </h3>
                <p className="mt-2 font-medium text-slate-600">{belief.tagline}</p>
                {belief.description && (
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">{belief.description}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
