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
              className={`flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold uppercase tracking-wide ${
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
      <div className="relative flex min-h-[85vh] items-center overflow-hidden bg-slate-950 py-20 sm:py-28">
        {/* textura halftone — remete a impressão de cartaz/lambe de campanha */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '14px 14px',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-primary opacity-20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-secondary opacity-15 blur-3xl"
        />

        <div className="relative mx-auto grid w-full max-w-6xl gap-14 px-6 sm:grid-cols-[1.1fr_360px] sm:items-center">
          {/* z-10 + margem negativa: a headline invade a área da foto, como
              tipografia colada por cima de um cartaz */}
          <div className="relative z-10">
            <p className="mb-5 inline-block -rotate-1 border-2 border-slate-900 bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-900">
              {settings.position}
              {settings.partyAcronym ? ` · ${settings.partyAcronym}` : ''}
            </p>

            <h1 className="max-w-2xl font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:-mr-28 sm:text-7xl">
              {settings.slogan || settings.candidateName}
            </h1>

            {settings.slogan && (
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.25em] text-white/60">
                {settings.candidateName}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#seguinte"
                className="inline-flex w-fit items-center gap-2 border-2 border-slate-900 bg-accent px-6 py-3 text-sm font-black uppercase tracking-wide text-slate-900 shadow-hard-sm transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard"
              >
                Conheça as propostas
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="#contato"
                className="inline-flex w-fit items-center border-2 border-white/40 px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition-colors hover:border-white hover:bg-white hover:text-slate-900"
              >
                Fale comigo
              </a>
            </div>
          </div>

          {settings.heroBackgroundImageUrl && (
            <div className="relative mx-auto w-64 shrink-0 sm:w-full">
              {/* bloco accent deslocado atrás da foto — versão mais leve e
                  gráfica do que os 3 ecos desfocados (menos peso no LCP) */}
              <div aria-hidden className="absolute -bottom-4 -right-4 h-full w-full bg-accent" />
              <div
                aria-hidden
                className="absolute -left-6 -top-6 z-10 h-20 w-20"
                style={{
                  backgroundImage: 'radial-gradient(circle, var(--color-accent, #fde047) 2px, transparent 2px)',
                  backgroundSize: '10px 10px',
                }}
              />
              <div className="relative aspect-[4/5] overflow-hidden border-2 border-white/15 shadow-[0_0_70px_-12px_var(--color-primary)]">
                <Image
                  src={settings.heroBackgroundImageUrl}
                  alt={settings.candidateName}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {hasMomentumBand && (
        <div className="border-t-4 border-accent bg-slate-900 py-8 text-white">
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
