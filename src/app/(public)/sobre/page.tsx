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
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full bg-slate-100">
            <Image src={settings.profilePhotoUrl} alt={settings.candidateName} fill className="object-cover" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{settings.candidateName}</h1>
          {settings.aboutTagline && <p className="mt-2 text-lg font-medium text-primary">{settings.aboutTagline}</p>}
        </div>
      </div>

      {settings.aboutFullText && (
        <div
          className="prose prose-slate mt-10 max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizeRichText(settings.aboutFullText) }}
        />
      )}

      {timeline.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-slate-900">Trajetória</h2>
          <ol className="mt-6 space-y-6 border-l-2 border-slate-200 pl-6">
            {timeline.map((item) => (
              <li key={item.id}>
                {item.year && <span className="text-sm font-semibold text-primary">{item.year}</span>}
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                {item.description && <p className="mt-1 text-sm text-slate-600">{item.description}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {comissoes.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-slate-900">Comissões e cargos</h2>
          <ul className="mt-6 space-y-4">
            {comissoes.map((comissao) => (
              <li key={comissao.id} className="border-b border-slate-100 pb-4">
                <p className="font-semibold text-slate-900">{comissao.title}</p>
                <p className="text-sm text-slate-500">
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
