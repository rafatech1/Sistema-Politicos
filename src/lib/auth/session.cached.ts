import { cache } from 'react';
import { getSessionUser } from '@/lib/auth/session';

// Dedupe entre Server Components que leem a sessão na mesma requisição
// (layout do admin + a página em si sempre leem — todo layout+page do painel
// faz isso) — React cache() memoiza por request, evitando 2x
// prisma.user.findUnique() por navegação. Mesmo padrão de
// site-settings.cached.ts.
export const getCachedSessionUser = cache(getSessionUser);
