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
              className={`flex shrink-0 items-center gap-2 border-2 border-white bg-slate-800 px-4 py-2 text-sm font-bold uppercase tracking-wide ${
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
    <section className="bg-white">
      {/* Faixa do número — o dado mais importante de qualquer eleição no Brasil. */}
      <div className="flex items-center justify-center gap-4 bg-primary px-6 py-6 text-white sm:py-8">
        <span className="text-xs font-bold uppercase tracking-widest text-white/80">Vote</span>
        <span className="font-display text-[clamp(3.5rem,11vw,6.5rem)] font-black leading-none tracking-tight">
          {settings.candidateNumber}
        </span>
      </div>

      {/* Foto emoldurada + headline */}
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-[280px_1fr] sm:items-center sm:py-20">
        {settings.heroBackgroundImageUrl && (
          <div className="relative mx-auto aspect-[4/5] w-56 shrink-0 overflow-hidden border-4 border-slate-900 shadow-hard sm:w-full">
            <Image
              src={settings.heroBackgroundImageUrl}
              alt={settings.candidateName}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        <div>
          <p className="mb-4 inline-block -rotate-1 border-2 border-slate-900 bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-900">
            {settings.position}
            {settings.partyAcronym ? ` · ${settings.partyAcronym}` : ''}
          </p>

          <h1 className="max-w-2xl font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-slate-900 sm:text-6xl">
            {settings.slogan || settings.candidateName}
          </h1>

          <a
            href="#seguinte"
            className="mt-8 inline-flex w-fit items-center gap-2 border-2 border-slate-900 bg-accent px-6 py-3 text-sm font-black uppercase tracking-wide text-slate-900 shadow-hard-sm transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard"
          >
            Conheça as propostas
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      {hasMomentumBand && (
        <div className="border-y-2 border-slate-900 bg-slate-900 py-8 text-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
            {countdownActive && settings.electionDate && (
              <div className="shrink-0">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/70">
                  Faltam para a eleição
                </p>
                <ElectionCountdown electionDateIso={settings.electionDate.toISOString()} />
              </div>
            )}

            {badges.length > 0 && (
              <div className="min-w-0 flex-1">
                {countdownActive && (
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/70">Já conquistado</p>
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
