import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { SiteSettingsInput } from '@/lib/validations/site-settings.schema';

const SETTINGS_ID = 1;

const DEFAULT_SETTINGS = {
  id: SETTINGS_ID,
  candidateName: 'Nome do Candidato',
  candidateNumber: '00',
  partyAcronym: 'PARTIDO',
  position: 'Cargo Pretendido',
};

/**
 * Retorna a linha única de configurações do site, criando-a com valores
 * placeholder na primeira leitura caso ainda não exista (ex: antes de
 * `npm run setup` rodar) — assim a API/admin nunca quebra com 404/500 em um
 * banco recém-migrado.
 */
export async function getSiteSettings() {
  // upsert (não find + create) porque múltiplas páginas podem ser renderizadas
  // em paralelo (build estático / requisições concorrentes) e todas caírem no
  // "não existe ainda" ao mesmo tempo — find+create colidiria com violação de
  // unique constraint em id=1.
  return prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: DEFAULT_SETTINGS,
  });
}

export async function upsertSiteSettings(data: SiteSettingsInput, updatedById?: string | null) {
  await getSiteSettings(); // garante que a linha exista antes do update parcial

  // Json? não aceita `null` puro no update do Prisma — precisa de Prisma.JsonNull.
  const { extraLinks, homeSections, ...rest } = data;

  return prisma.siteSettings.update({
    where: { id: SETTINGS_ID },
    data: {
      ...rest,
      extraLinks: extraLinks === null ? Prisma.JsonNull : extraLinks,
      homeSections: homeSections === null ? Prisma.JsonNull : homeSections,
      updatedById: updatedById ?? null,
    },
  });
}
