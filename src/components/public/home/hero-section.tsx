import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { ElectionCountdown } from '@/components/public/election-countdown';

interface Badge {
  id: string;
  icon: string | null;
  text: string;
}

/**
 * Ticker horizontal das conquistas — o conteúdo é renderizado duas vezes
 * (a 2ª cópia com aria-hidden) para o loop CSS (translateX -50%) parecer
 * contínuo. Em prefers-reduced-motion, .animate-marquee some (ver
 * globals.css) e o flex-wrap assume, então a 2ª cópia precisa ficar oculta
 * nesse caso — senão cada conquista apareceria duplicada na tela.
 */
function AchievementTicker({ badges }: { badges: Badge[] }) {
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <ul className="flex w-max animate-marquee items-center gap-3 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:gap-y-2">
        {[false, true].map((isDuplicate) =>
          badges.map((badge) => (
            <li
              key={`${badge.id}${isDuplicate ? '-dup' : ''}`}
              aria-hidden={isDuplicate}
              className={`flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur ${
                isDuplicate ? 'motion-reduce:hidden' : ''
              }`}
            >
              {badge.icon && <span aria-hidden>{badge.icon}</span>}
              <span className="whitespace-nowrap">{badge.text}</span>
            </li>
          )),
        )}
      </ul>
    </div>
  );
}

export async function HeroSection() {
  const [settings, badges] = await Promise.all([
    getCachedSiteSettings(),
    prisma.achievementBadge.findMany({ orderBy: { order: 'asc' } }),
  ]);

  const countdownActive =
    settings.electionCountdownEnabled &&
    settings.electionDate &&
    settings.electionDate.getTime() > Date.now();

  const hasMomentumBand = badges.length > 0 || countdownActive;

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="relative flex min-h-[78vh] items-end overflow-hidden">
        {settings.heroBackgroundImageUrl ? (
          <>
            <Image
              src={settings.heroBackgroundImageUrl}
              alt=""
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/10" />
          </>
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: [
                'radial-gradient(circle at 25% 15%, var(--color-primary) 0%, transparent 45%)',
                'radial-gradient(circle at 80% 75%, var(--color-secondary) 0%, transparent 50%)',
              ].join(', '),
            }}
          />
        )}

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-32 sm:pb-20">
          <div
            className="animate-hero-in flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-widest text-white/70"
          >
            <span>{settings.position}</span>
            {settings.partyAcronym && (
              <>
                <span aria-hidden className="text-white/30">
                  ·
                </span>
                <span>{settings.partyAcronym}</span>
              </>
            )}
            <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold tracking-normal text-slate-900">
              Nº {settings.candidateNumber}
            </span>
          </div>

          <h1
            className="animate-hero-in mt-5 max-w-3xl font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl"
            style={{ animationDelay: '0.1s' }}
          >
            {settings.slogan || settings.candidateName}
          </h1>

          <a
            href="#seguinte"
            className="animate-hero-in mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-slate-900 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
            style={{ animationDelay: '0.3s' }}
          >
            Explore
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      {hasMomentumBand && (
        <div
          className="relative border-t-2 border-white/20 bg-primary pt-8"
          style={{ clipPath: 'polygon(0 22px, 100% 0, 100% 100%, 0 100%)' }}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-8 sm:flex-row sm:items-center sm:justify-between">
            {countdownActive && settings.electionDate && (
              <div className="shrink-0">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/70">
                  Faltam para a eleição
                </p>
                <ElectionCountdown electionDateIso={settings.electionDate.toISOString()} />
              </div>
            )}

            {badges.length > 0 && (
              <div className="min-w-0 flex-1">
                {countdownActive && (
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/70">
                    Já conquistado
                  </p>
                )}
                <AchievementTicker badges={badges} />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
