import Link from 'next/link';
import Image from 'next/image';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';

export async function AboutSection() {
  const settings = await getCachedSiteSettings();
  if (!settings.aboutShortText && !settings.aboutTagline) return null;

  return (
    <section className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-14 sm:grid-cols-[340px_1fr] sm:items-center">
        {settings.profilePhotoUrl && (
          <div className="relative mx-auto w-64 sm:w-full">
            {/* "fitas" accent nos cantos — a foto parece colada na página */}
            <span
              aria-hidden
              className="absolute -left-4 -top-3 z-10 h-6 w-20 -rotate-45 border border-slate-900/20 bg-accent"
            />
            <span
              aria-hidden
              className="absolute -bottom-3 -right-4 z-10 h-6 w-20 -rotate-45 border border-slate-900/20 bg-accent"
            />
            <div className="relative aspect-square overflow-hidden border-4 border-slate-900 bg-slate-100 shadow-hard">
              <Image src={settings.profilePhotoUrl} alt={settings.candidateName} fill className="object-cover" />
            </div>
          </div>
        )}
        <div>
          <p className="mb-3 inline-block -rotate-1 border-2 border-slate-900 bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-slate-900">
            Sobre
          </p>

          {/* a tagline é a frase mais forte da seção — vira a manchete,
              e o nome vira o crédito abaixo dela */}
          {settings.aboutTagline ? (
            <>
              <blockquote className="font-display text-3xl font-black uppercase leading-[1.02] tracking-tight text-slate-900 sm:text-5xl">
                “{settings.aboutTagline}”
              </blockquote>
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.25em] text-primary">
                — {settings.candidateName}
              </p>
            </>
          ) : (
            <h2 className="font-display text-3xl font-black uppercase leading-[0.95] tracking-tight text-slate-900 sm:text-4xl">
              {settings.candidateName}
            </h2>
          )}

          {settings.aboutShortText && (
            <p className="mt-6 max-w-xl leading-relaxed text-slate-600">{settings.aboutShortText}</p>
          )}
          <Link
            href="/sobre"
            className="group/cta mt-6 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-slate-900 transition-colors hover:text-primary"
          >
            Conheça minha história
            <span aria-hidden className="transition-transform group-hover/cta:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
