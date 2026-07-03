import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';

// Consulta o banco (site_settings + conteúdo publicado) — força geração em
// tempo de requisição em vez de build, mesma razão do layout raiz (ver
// src/app/layout.tsx): `next build` não tem banco acessível.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const settings = await getCachedSiteSettings();

  const staticRoutes = [
    '/',
    '/sobre',
    '/noticias',
    '/busca',
    '/termos-de-uso',
    '/politica-de-privacidade',
    settings.mode === 'MANDATE' ? '/projetos-de-lei' : '/propostas',
  ].map((path) => ({ url: `${base}${path}` }));

  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true },
  });
  const postRoutes = posts.map((post) => ({
    url: `${base}/noticias/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  const contentRoutes =
    settings.mode === 'MANDATE'
      ? await prisma.projetoDeLei
          .findMany({ where: { publishStatus: 'PUBLISHED' }, select: { slug: true, updatedAt: true } })
          .then((items) => items.map((item) => ({ url: `${base}/projetos-de-lei/${item.slug}`, lastModified: item.updatedAt })))
      : await prisma.proposta
          .findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } })
          .then((items) => items.map((item) => ({ url: `${base}/propostas/${item.slug}`, lastModified: item.updatedAt })));

  return [...staticRoutes, ...postRoutes, ...contentRoutes];
}
