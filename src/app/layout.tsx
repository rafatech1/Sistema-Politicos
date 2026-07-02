import type { CSSProperties, ReactNode } from 'react';
import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/services/site-settings.service';
import './globals.css';

// site_settings alimenta tema/metadata deste layout raiz. revalidatePath é
// disparado a cada PUT em /api/admin/settings (ver src/app/api/admin/settings/route.ts);
// este revalidate por tempo é só um fallback de segurança para outros
// caminhos de escrita (setup, seed, edição direta no banco).
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.metaTitle || `${settings.candidateName} — ${settings.position}`;
  const description = settings.metaDescription || settings.slogan || undefined;

  return {
    title,
    description,
    icons: settings.faviconUrl ? [{ url: settings.faviconUrl }] : undefined,
    openGraph: {
      title,
      description,
      images: settings.ogImageUrl ? [{ url: settings.ogImageUrl }] : undefined,
      locale: 'pt_BR',
      type: 'website',
    },
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();

  const themeStyle: CSSProperties = {
    ['--color-primary' as string]: settings.primaryColor,
    ['--color-secondary' as string]: settings.secondaryColor,
    ['--color-accent' as string]: settings.accentColor || settings.secondaryColor,
  };

  return (
    <html lang="pt-BR" style={themeStyle}>
      <body>{children}</body>
    </html>
  );
}
