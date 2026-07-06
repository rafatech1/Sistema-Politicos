import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { SectionHeading } from './section-heading';

export async function OfficeSection() {
  const settings = await getCachedSiteSettings();
  if (!settings.officeAddress && !settings.officeMapEmbedUrl) return null;

  return (
    <section className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 sm:items-center">
        <div>
          <SectionHeading eyebrow="Presença" title="Gabinete / Comitê" />
          {settings.officeAddress && <p className="leading-relaxed text-slate-600">{settings.officeAddress}</p>}
        </div>
        {settings.officeMapEmbedUrl && (
          <div className="aspect-video overflow-hidden border-2 border-slate-900 shadow-hard">
            <iframe
              src={settings.officeMapEmbedUrl}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa do gabinete/comitê"
            />
          </div>
        )}
      </div>
    </section>
  );
}
