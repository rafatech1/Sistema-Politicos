import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { getNavItems } from '@/lib/nav';
import { SiteHeaderClient } from '@/components/public/site-header-client';

export async function SiteHeader() {
  const settings = await getCachedSiteSettings();
  const navItems = getNavItems(settings.mode);

  return (
    <SiteHeaderClient
      candidateName={settings.candidateName}
      candidateNumber={settings.candidateNumber}
      logoUrl={settings.logoUrl}
      navItems={navItems}
      socialData={settings}
    />
  );
}
