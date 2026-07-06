'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SocialIcons, type SocialLinksData } from '@/components/public/social-icons';
import { MobileNav } from '@/components/public/mobile-nav';
import type { NavItem } from '@/lib/nav';

// Header sempre sólido (nunca sobrepõe transparente ao hero): o hero
// santinho abre com um bloco na cor primária do candidato, que pode ser
// clara ou escura — texto branco flutuante não teria contraste garantido
// contra uma cor arbitrária, então o cabeçalho não depende dela.
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
  return (
    <header className="sticky inset-x-0 top-0 z-40 border-b-2 border-slate-900 bg-white">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={candidateName}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full border-2 border-slate-900 object-cover"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-900 bg-primary text-sm font-bold text-white">
              {candidateNumber.slice(0, 2)}
            </span>
          )}
          <span className="hidden font-display text-lg font-black uppercase text-slate-900 sm:inline">
            {candidateName}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-bold uppercase tracking-wide text-slate-700 sm:flex">
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
              className="w-40 rounded-md border-2 border-slate-900 px-3 py-1.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </form>
          <SocialIcons
            data={socialData}
            className="flex items-center gap-2"
            iconClassName="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-slate-700 transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-white"
          />
        </div>

        <MobileNav navItems={navItems} />
      </div>
    </header>
  );
}
