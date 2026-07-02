import { cache } from 'react';
import { getSiteSettings } from '@/lib/services/site-settings.service';

// Dedupe entre Server Components que leem site_settings na mesma requisição
// (header, footer, WhatsApp button e a página em si acabam todos precisando
// dela) — React cache() memoiza por request, evitando N idas ao banco.
// Uso restrito a Server Components/Route Handlers dentro do ciclo de
// requisição do Next.js; scripts standalone (setup/seed) usam a versão
// não cacheada diretamente.
export const getCachedSiteSettings = cache(getSiteSettings);
