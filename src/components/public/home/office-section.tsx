import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { SectionHeading } from '@/components/public/section-heading';

export async function OfficeSection() {
  const settings = await getCachedSiteSettings();
  if (!settings.officeAddress && !settings.officeMapEmbedUrl) return null;

  return (
    <section className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-2 sm:items-center">
        <div>
          <SectionHeading eyebrow="Presença" title="Gabinete / Comitê" />
          {settings.officeAddress && (
            <div className="flex gap-4 border-l-4 border-accent pl-5">
              <p className="leading-relaxed text-slate-600">{settings.officeAddress}</p>
            </div>
          )}
        </div>
        {settings.officeMapEmbedUrl && (
          <div className="relative">
            <div aria-hidden className="absolute -bottom-3 -right-3 h-full w-full bg-accent" />
            <div className="relative aspect-video overflow-hidden border-2 border-slate-900 bg-slate-100">
              <iframe
                src={settings.officeMapEmbedUrl}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa do gabinete/comitê"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
