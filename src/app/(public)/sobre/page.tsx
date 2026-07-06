import Image from 'next/image';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { sanitizeRichText } from '@/lib/utils/sanitize-html';

export const metadata: Metadata = { title: 'Sobre' };

function formatYearRange(start: Date | null, end: Date | null) {
  const startYear = start ? start.getFullYear() : null;
  const endYear = end ? end.getFullYear() : 'atual';
  if (!startYear) return '';
  return `${startYear} — ${endYear}`;
}

export default async function SobrePage() {
  const [settings, timeline, comissoes] = await Promise.all([
    getCachedSiteSettings(),
    prisma.biografiaTimelineItem.findMany({ orderBy: { order: 'asc' } }),
    prisma.comissao.findMany({ orderBy: { order: 'asc' } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        {settings.profilePhotoUrl && (
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-slate-900 bg-slate-100">
            <Image src={settings.profilePhotoUrl} alt={settings.candidateName} fill className="object-cover" />
          </div>
        )}
        <div>
          <h1 className="font-display text-3xl font-black uppercase leading-[0.95] text-slate-900">
            {settings.candidateName}
          </h1>
          {settings.aboutTagline && (
            <p className="mt-2 font-display text-lg italic text-slate-700">“{settings.aboutTagline}”</p>
          )}
        </div>
      </div>

      {settings.aboutFullText && (
        <div
          className="prose prose-slate mt-10 max-w-none prose-headings:font-display prose-headings:font-black prose-headings:uppercase prose-a:font-bold prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: sanitizeRichText(settings.aboutFullText) }}
        />
      )}

      {timeline.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-black uppercase text-slate-900">Trajetória</h2>
          <ol className="mt-6 space-y-6 border-l-2 border-slate-900 pl-6">
            {timeline.map((item) => (
              <li key={item.id}>
                {item.year && (
                  <span className="inline-block -rotate-1 border-2 border-slate-900 bg-accent px-2 py-0.5 text-xs font-bold text-slate-900">
                    {item.year}
                  </span>
                )}
                <h3 className="mt-1.5 font-display font-black uppercase text-slate-900">{item.title}</h3>
                {item.description && <p className="mt-1 text-sm text-slate-600">{item.description}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {comissoes.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-black uppercase text-slate-900">Comissões e cargos</h2>
          <ul className="mt-6 space-y-4">
            {comissoes.map((comissao) => (
              <li key={comissao.id} className="border-b-2 border-slate-200 pb-4">
                <p className="font-display font-black uppercase text-slate-900">{comissao.title}</p>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  {comissao.organization}
                  {comissao.organization && ' · '}
                  {formatYearRange(comissao.startDate, comissao.endDate)}
                </p>
                {comissao.description && <p className="mt-1 text-sm text-slate-600">{comissao.description}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
