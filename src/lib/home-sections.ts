// Fonte única das seções da Home: chaves válidas, ordem/estado padrão.
// Reaproveitada pelo service (valor inicial de site_settings.homeSections),
// pelos componentes da Home (para saber o que renderizar e em que ordem) e
// pela curadoria no painel admin (settings-form.tsx).

export const HOME_SECTION_KEYS = [
  'HERO',
  'NEWS',
  'HIGHLIGHTS',
  'AGENDA',
  'ABOUT',
  'BELIEFS',
  'VIDEOS',
  'INSTAGRAM',
  'SOCIAL_BAR',
  'OFFICE',
  'CONTACT',
] as const;

export type HomeSectionKey = (typeof HOME_SECTION_KEYS)[number];

export interface HomeSectionConfig {
  key: HomeSectionKey;
  enabled: boolean;
  order: number;
}

export const HOME_SECTION_LABELS: Record<HomeSectionKey, string> = {
  HERO: 'Hero',
  NEWS: 'Últimas Notícias',
  HIGHLIGHTS: 'Projetos de Lei / Propostas',
  AGENDA: 'Próximos eventos (Agenda)',
  ABOUT: 'Sobre / Biografia resumida',
  BELIEFS: 'No que acredito',
  VIDEOS: 'Vídeos do YouTube',
  INSTAGRAM: 'Instagram / Redes',
  SOCIAL_BAR: 'Barra de redes sociais',
  OFFICE: 'Gabinete / Comitê',
  CONTACT: 'Contato',
};

export function defaultHomeSections(): HomeSectionConfig[] {
  return HOME_SECTION_KEYS.map((key, index) => ({ key, enabled: true, order: index }));
}

/** Normaliza o JSON salvo em site_settings.homeSections, preenchendo seções
 * ausentes com o padrão (ex: campo novo adicionado depois do onboarding). */
export function resolveHomeSections(stored: unknown): HomeSectionConfig[] {
  const defaults = defaultHomeSections();
  if (!Array.isArray(stored)) return defaults;

  const byKey = new Map<string, HomeSectionConfig>();
  for (const item of stored) {
    if (
      item &&
      typeof item === 'object' &&
      'key' in item &&
      HOME_SECTION_KEYS.includes((item as { key: string }).key as HomeSectionKey)
    ) {
      const config = item as HomeSectionConfig;
      byKey.set(config.key, config);
    }
  }

  return defaults
    .map((def) => byKey.get(def.key) ?? def)
    .sort((a, b) => a.order - b.order);
}
