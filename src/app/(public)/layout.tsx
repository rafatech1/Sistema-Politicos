import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/public/site-header';
import { SiteFooter } from '@/components/public/site-footer';
import { WhatsAppFloatButton } from '@/components/public/whatsapp-float-button';
import { CookieBanner } from '@/components/public/cookie-banner';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFloatButton />
      <CookieBanner />
    </div>
  );
}
