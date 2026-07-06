import type { SiteMode } from '@prisma/client';

export interface NavItem {
  label: string;
  href: string;
}

/** Itens de navegação visíveis conforme o modo do site (Campanha/Mandato). */
export function getNavItems(mode: SiteMode): NavItem[] {
  return [
    { label: 'Início', href: '/' },
    { label: 'Notícias', href: '/noticias' },
    { label: 'Agenda', href: '/agenda' },
    mode === 'MANDATE'
      ? { label: 'Projetos de Lei', href: '/projetos-de-lei' }
      : { label: 'Propostas', href: '/propostas' },
    { label: 'Sobre', href: '/sobre' },
  ];
}
