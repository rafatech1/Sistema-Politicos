import Link from 'next/link';

export function SectionHeading({
  eyebrow,
  title,
  ctaLabel,
  ctaHref,
  ctaExternal,
  as = 'h2',
  variant = 'default',
}: {
  eyebrow?: string;
  title: string;
  ctaLabel?: string;
  ctaHref?: string | null;
  ctaExternal?: boolean;
  /** 'h1' para título de página isolada (ex: /noticias); 'h2' (padrão) para seções dentro da home. */
  as?: 'h1' | 'h2';
  /** 'editorial' — usado só em Próximos eventos / No que acredito (fundo cru, serifa, verde). */
  variant?: 'default' | 'editorial';
}) {
  const Heading = as;

  if (variant === 'editorial') {
    return (
      <div className="mb-10 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {eyebrow && (
            <p className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-editorial-accent">
              — {eyebrow}
            </p>
          )}
          <Heading className="font-serif text-3xl font-medium leading-tight text-editorial-ink sm:text-4xl">
            {title}
          </Heading>
        </div>
        {ctaLabel &&
          ctaHref &&
          (ctaExternal ? (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group/cta inline-flex shrink-0 items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-editorial-muted transition-colors hover:text-editorial-accent"
            >
              {ctaLabel}
              <span aria-hidden className="transition-transform group-hover/cta:translate-x-1">
                →
              </span>
            </a>
          ) : (
            <Link
              href={ctaHref}
              className="group/cta inline-flex shrink-0 items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-editorial-muted transition-colors hover:text-editorial-accent"
            >
              {ctaLabel}
              <span aria-hidden className="transition-transform group-hover/cta:translate-x-1">
                →
              </span>
            </Link>
          ))}
      </div>
    );
  }

  const ctaClassName =
    'group/cta inline-flex shrink-0 items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-slate-900 transition-colors hover:text-primary';

  return (
    <div className="mb-10 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-3 inline-block -rotate-1 border-2 border-slate-900 bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-slate-900">
            {eyebrow}
          </p>
        )}
        <Heading className="font-display text-3xl font-black uppercase leading-[0.95] tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </Heading>
      </div>
      {ctaLabel &&
        ctaHref &&
        (ctaExternal ? (
          <a href={ctaHref} target="_blank" rel="noopener noreferrer" className={ctaClassName}>
            {ctaLabel}
            <span aria-hidden className="transition-transform group-hover/cta:translate-x-1">
              →
            </span>
          </a>
        ) : (
          <Link href={ctaHref} className={ctaClassName}>
            {ctaLabel}
            <span aria-hidden className="transition-transform group-hover/cta:translate-x-1">
              →
            </span>
          </Link>
        ))}
    </div>
  );
}
