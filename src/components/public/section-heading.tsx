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
  /** 'mural' — usado só nas 4 seções de conteúdo do "Mural de Campanha" (ver src/lib/mural.ts). */
  variant?: 'default' | 'mural';
}) {
  const isMural = variant === 'mural';
  const ctaClassName = isMural
    ? 'group/cta inline-flex shrink-0 items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-mural-ink transition-colors hover:text-mural-pin'
    : 'group/cta inline-flex shrink-0 items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-slate-900 transition-colors hover:text-primary';
  const Heading = as;

  return (
    <div className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow &&
          (isMural ? (
            <p className="mb-3 inline-block -rotate-2 bg-mural-tape/90 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-mural-ink shadow-sm">
              {eyebrow}
            </p>
          ) : (
            <p className="mb-3 inline-block -rotate-1 border-2 border-slate-900 bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-slate-900">
              {eyebrow}
            </p>
          ))}
        <Heading
          className={
            isMural
              ? 'font-display text-3xl font-black uppercase leading-[0.95] tracking-tight text-mural-ink sm:text-4xl'
              : 'font-display text-3xl font-black uppercase leading-[0.95] tracking-tight text-slate-900 sm:text-4xl'
          }
        >
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
