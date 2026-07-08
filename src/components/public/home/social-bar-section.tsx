import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { SocialIcons } from '@/components/public/social-icons';

/**
 * Antes uma seção inteira só para os ícones; agora é uma faixa compacta
 * que funciona como divisor de ritmo entre blocos de conteúdo.
 */
export async function SocialBarSection() {
  const settings = await getCachedSiteSettings();

  return (
    <section className="border-y-2 border-slate-900 bg-primary px-6 py-8 text-white sm:py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">Redes sociais</p>
          <h2 className="mt-1 font-display text-2xl font-black uppercase leading-[0.95] tracking-tight sm:text-3xl">
            Me acompanhe nas redes
          </h2>
        </div>
        <SocialIcons
          data={settings}
          className="flex flex-wrap items-center justify-center gap-3"
          iconClassName="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-transparent text-white transition-all hover:-translate-y-1 hover:bg-white hover:text-primary"
          iconSize={20}
        />
      </div>
    </section>
  );
}
