import Link from 'next/link';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { SocialIcons } from '@/components/public/social-icons';
import { getNavItems } from '@/lib/nav';

export async function SiteFooter() {
  const settings = await getCachedSiteSettings();
  const navItems = getNavItems(settings.mode);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-primary bg-slate-900 text-white">
      <div className="mx-auto max-w-6xl space-y-8 px-6 py-12 sm:py-16">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-xl font-semibold">
              {settings.candidateName} {settings.candidateNumber}
            </p>
            <p className="mt-1 text-sm text-white/60">
              {settings.position}
              {settings.partyAcronym ? ` · ${settings.partyAcronym}` : ''}
            </p>
          </div>
          <SocialIcons
            data={settings}
            iconClassName="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:-translate-y-0.5 hover:bg-primary"
          />
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-white">
              {item.label}
            </Link>
          ))}
          <Link href="/termos-de-uso" className="transition-colors hover:text-white">
            Termos de Uso
          </Link>
          <Link href="/politica-de-privacidade" className="transition-colors hover:text-white">
            Política de Privacidade
          </Link>
        </nav>

        {(settings.contactEmail || settings.contactPhone) && (
          <p className="text-sm text-white/60">
            {settings.contactEmail}
            {settings.contactEmail && settings.contactPhone ? ' · ' : ''}
            {settings.contactPhone}
          </p>
        )}

        <div className="space-y-2 border-t border-white/10 pt-6 text-xs text-white/50">
          {settings.tseIdentification && <p>{settings.tseIdentification}</p>}
          {settings.campaignCnpj && <p>CNPJ da campanha: {settings.campaignCnpj}</p>}
          <p>
            {settings.footerText || `${settings.candidateName} ${settings.candidateNumber}`} © {year}
          </p>
        </div>
      </div>
    </footer>
  );
}
