import Link from 'next/link';
import Image from 'next/image';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';

export async function AboutSection() {
  const settings = await getCachedSiteSettings();
  if (!settings.aboutShortText && !settings.aboutTagline) return null;

  return (
    <section className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-[340px_1fr] sm:items-center">
        {settings.profilePhotoUrl && (
          <div className="relative mx-auto aspect-square w-64 overflow-hidden rounded-2xl bg-slate-100 shadow-card sm:w-full">
            <Image src={settings.profilePhotoUrl} alt={settings.candidateName} fill className="object-cover" />
          </div>
        )}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Sobre</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {settings.candidateName}
          </h2>
          {settings.aboutTagline && (
            <p className="mt-4 font-display text-xl italic text-slate-700">“{settings.aboutTagline}”</p>
          )}
          {settings.aboutShortText && (
            <p className="mt-5 leading-relaxed text-slate-600">{settings.aboutShortText}</p>
          )}
          <Link
            href="/sobre"
            className="group/cta mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-slate-900"
          >
            Saiba mais
            <span aria-hidden className="transition-transform group-hover/cta:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
