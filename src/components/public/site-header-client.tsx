'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { SocialIcons, type SocialLinksData } from '@/components/public/social-icons';
import { MobileNav } from '@/components/public/mobile-nav';
import type { NavItem } from '@/lib/nav';

export function SiteHeaderClient({
  candidateName,
  candidateNumber,
  logoUrl,
  navItems,
  socialData,
}: {
  candidateName: string;
  candidateNumber: string;
  logoUrl: string | null;
  navItems: NavItem[];
  socialData: SocialLinksData;
}) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return;

    function onScroll() {
      setScrolled(window.scrollY > 40);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const transparent = isHome && !scrolled;

  return (
    <header
      className={`${isHome ? 'fixed' : 'sticky'} inset-x-0 top-0 z-40 transition-all duration-300 ${
        transparent
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur'
      }`}
    >
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={candidateName}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              {candidateNumber.slice(0, 2)}
            </span>
          )}
          <span
            className={`hidden font-display text-lg font-semibold transition-colors sm:inline ${
              transparent ? 'text-white' : 'text-slate-900'
            }`}
          >
            {candidateName}
          </span>
        </Link>

        <nav
          className={`hidden items-center gap-8 text-sm font-medium transition-colors sm:flex ${
            transparent ? 'text-white/90' : 'text-slate-700'
          }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative py-1 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:w-0 after:transition-all after:duration-300 hover:after:w-full ${
                transparent ? 'hover:text-white after:bg-white' : 'hover:text-slate-900 after:bg-primary'
              }`}
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
              className={`w-40 rounded-full border px-3 py-1.5 text-sm transition-colors focus:outline-none focus:ring-2 ${
                transparent
                  ? 'border-white/30 bg-white/10 text-white placeholder:text-white/60 focus:border-white focus:ring-white/30'
                  : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20'
              }`}
            />
          </form>
          <SocialIcons
            data={socialData}
            className="flex items-center gap-2"
            iconClassName={
              transparent
                ? 'flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:-translate-y-0.5 hover:bg-white hover:text-primary'
                : 'flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-white'
            }
          />
        </div>

        <MobileNav navItems={navItems} transparent={transparent} />
      </div>
    </header>
  );
}
