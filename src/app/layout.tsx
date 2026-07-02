import type { CSSProperties, ReactNode } from 'react';
import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
});

// axes: ['opsz'] é o que dá à Fraunces seu caráter editorial (sem isso, o
// next/font só carrega o eixo wght e ela fica "só mais uma serif genérica").
const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  axes: ['opsz'],
  variable: '--font-display',
  display: 'swap',
});

// site_settings alimenta tema/metadata deste layout raiz e é lido em toda
// requisição — força renderização dinâmica (sem tentativa de pré-geração
// estática no build, que exigiria banco acessível durante `next build`) e
// garante que mudanças feitas em /admin/settings apareçam imediatamente,
// sem depender de revalidação por tempo.
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings();
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
  const settings = await getCachedSiteSettings();

  const themeStyle: CSSProperties = {
    ['--color-primary' as string]: settings.primaryColor,
    ['--color-secondary' as string]: settings.secondaryColor,
    ['--color-accent' as string]: settings.accentColor || settings.secondaryColor,
  };

  return (
    <html lang="pt-BR" className={`${inter.variable} ${fraunces.variable}`} style={themeStyle}>
      <body>{children}</body>
    </html>
  );
}
