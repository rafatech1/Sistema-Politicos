// Fonte única das seções da Home: chaves válidas, ordem/estado padrão.
// Reaproveitada pelo service (valor inicial de site_settings.homeSections) e
// pelos componentes da Home (para saber o que renderizar e em que ordem).
// TODO(admin CRUD): expor toggle/reordenação no painel.

export const HOME_SECTION_KEYS = [
  'HERO',
  'NEWS',
  'HIGHLIGHTS',
  'ABOUT',
  'BELIEFS',
  'VIDEOS',
  'INSTAGRAM',
  'OFFICE',
  'CONTACT',
] as const;

export type HomeSectionKey = (typeof HOME_SECTION_KEYS)[number];

export interface HomeSectionConfig {
  key: HomeSectionKey;
  enabled: boolean;
  order: number;
}

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
