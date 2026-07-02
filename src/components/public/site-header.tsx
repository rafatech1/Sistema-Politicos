import Link from 'next/link';
import Image from 'next/image';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { SocialIcons } from '@/components/public/social-icons';
import { MobileNav } from '@/components/public/mobile-nav';
import { getNavItems } from '@/lib/nav';

export async function SiteHeader() {
  const settings = await getCachedSiteSettings();
  const navItems = getNavItems(settings.mode);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          {settings.logoUrl ? (
            <Image
              src={settings.logoUrl}
              alt={settings.candidateName}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              {settings.candidateNumber.slice(0, 2)}
            </span>
          )}
          <span className="hidden font-display text-lg font-semibold text-slate-900 sm:inline">
            {settings.candidateName}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative py-1 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:text-slate-900 hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 sm:flex">
          <form action="/busca" method="GET" className="flex items-center">
            <input
              type="search"
              name="q"
              placeholder="Buscar..."
              aria-label="Buscar no site"
              className="w-40 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </form>
          <SocialIcons
            data={settings}
            className="flex items-center gap-2"
            iconClassName="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-white"
          />
        </div>

        <MobileNav navItems={navItems} />
      </div>
    </header>
  );
}
