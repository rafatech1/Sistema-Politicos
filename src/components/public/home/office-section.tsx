import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';

export async function OfficeSection() {
  const settings = await getCachedSiteSettings();
  if (!settings.officeAddress && !settings.officeMapEmbedUrl) return null;

  return (
    <section className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 sm:items-center">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Presença</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Gabinete / Comitê
          </h2>
          {settings.officeAddress && <p className="mt-4 leading-relaxed text-slate-600">{settings.officeAddress}</p>}
        </div>
        {settings.officeMapEmbedUrl && (
          <div className="aspect-video overflow-hidden rounded-2xl border border-slate-200 shadow-card">
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
