import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { ElectionCountdown } from '@/components/public/election-countdown';

export async function HeroSection() {
  const [settings, badges] = await Promise.all([
    getCachedSiteSettings(),
    prisma.achievementBadge.findMany({ orderBy: { order: 'asc' } }),
  ]);

  const countdownActive =
    settings.electionCountdownEnabled &&
    settings.electionDate &&
    settings.electionDate.getTime() > Date.now();

  return (
    <section className="relative flex min-h-[85vh] items-end overflow-hidden bg-primary text-white">
      {settings.heroBackgroundImageUrl && (
        <Image
          src={settings.heroBackgroundImageUrl}
          alt=""
          fill
          priority
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-32 sm:pb-24">
        <h1
          className="animate-hero-in max-w-3xl font-display text-5xl font-medium leading-[1.1] tracking-tight sm:text-7xl"
          style={{ animationDelay: '0.05s' }}
        >
          {settings.slogan || settings.candidateName}
        </h1>

        {badges.length > 0 && (
          <ul
            className="animate-hero-in mt-8 flex flex-wrap gap-3"
            style={{ animationDelay: '0.2s' }}
          >
            {badges.map((badge) => (
              <li
                key={badge.id}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm backdrop-blur"
              >
                {badge.icon && <span aria-hidden>{badge.icon}</span>}
                <span>{badge.text}</span>
              </li>
            ))}
          </ul>
        )}

        {countdownActive && settings.electionDate && (
          <div className="animate-hero-in mt-8" style={{ animationDelay: '0.3s' }}>
            <ElectionCountdown electionDateIso={settings.electionDate.toISOString()} />
          </div>
        )}

        <a
          href="#seguinte"
          className="animate-hero-in mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-slate-900 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
          style={{ animationDelay: '0.4s' }}
        >
          Explore
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}
