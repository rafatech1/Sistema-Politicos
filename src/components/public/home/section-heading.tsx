import Link from 'next/link';

export function SectionHeading({
  eyebrow,
  title,
  ctaLabel,
  ctaHref,
  ctaExternal,
}: {
  eyebrow?: string;
  title: string;
  ctaLabel?: string;
  ctaHref?: string | null;
  ctaExternal?: boolean;
}) {
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
        <h2 className="font-display text-3xl font-black uppercase leading-[0.95] tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h2>
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
