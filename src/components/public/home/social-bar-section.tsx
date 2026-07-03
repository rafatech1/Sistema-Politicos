import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { SocialIcons } from '@/components/public/social-icons';

export async function SocialBarSection() {
  const settings = await getCachedSiteSettings();

  return (
    <section className="bg-primary px-6 py-16 text-white sm:py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Redes sociais</p>
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Me acompanhe nas redes
        </h2>
        <SocialIcons
          data={settings}
          className="mt-2 flex flex-wrap items-center justify-center gap-4"
          iconClassName="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-all hover:-translate-y-1 hover:bg-white hover:text-primary"
          iconSize={24}
        />
      </div>
    </section>
  );
}
