import { prisma } from '@/lib/prisma';
import type { SiteMode } from '@prisma/client';

export interface SearchResult {
  type: 'post' | 'proposta' | 'projeto-de-lei';
  id: string;
  title: string;
  summary: string | null;
  slug: string;
  href: string;
}

/**
 * Busca full-text em português (Postgres tsvector) em Notícias + Propostas
 * (modo Campanha) ou Projetos de Lei (modo Mandato). Usa $queryRaw porque o
 * Prisma Client não sabe ler colunas tsvector geradas — ver
 * prisma/migrations/*_fulltext_search*.
 */
export async function searchContent(query: string, mode: SiteMode): Promise<SearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const posts = await prisma.$queryRaw<
    Array<{ id: string; title: string; excerpt: string | null; slug: string }>
  >`
    SELECT id, title, excerpt, slug FROM posts
    WHERE status = 'PUBLISHED' AND search_vector @@ plainto_tsquery('portuguese', ${trimmed})
    ORDER BY ts_rank(search_vector, plainto_tsquery('portuguese', ${trimmed})) DESC
    LIMIT 10
  `;

  const postResults: SearchResult[] = posts.map((p) => ({
    type: 'post',
    id: p.id,
    title: p.title,
    summary: p.excerpt,
    slug: p.slug,
    href: `/noticias/${p.slug}`,
  }));

  if (mode === 'MANDATE') {
    const projetos = await prisma.$queryRaw<
      Array<{ id: string; title: string; summary: string | null; slug: string; number: string }>
    >`
      SELECT id, title, summary, slug, number FROM projetos_de_lei
      WHERE "publishStatus" = 'PUBLISHED' AND search_vector @@ plainto_tsquery('portuguese', ${trimmed})
      ORDER BY ts_rank(search_vector, plainto_tsquery('portuguese', ${trimmed})) DESC
      LIMIT 10
    `;

    return [
      ...postResults,
      ...projetos.map((pl) => ({
        type: 'projeto-de-lei' as const,
        id: pl.id,
        title: `PL ${pl.number} — ${pl.title}`,
        summary: pl.summary,
        slug: pl.slug,
        href: `/projetos-de-lei/${pl.slug}`,
      })),
    ];
  }

  const propostas = await prisma.$queryRaw<
    Array<{ id: string; title: string; summary: string | null; slug: string }>
  >`
    SELECT id, title, summary, slug FROM propostas
    WHERE status = 'PUBLISHED' AND search_vector @@ plainto_tsquery('portuguese', ${trimmed})
    ORDER BY ts_rank(search_vector, plainto_tsquery('portuguese', ${trimmed})) DESC
    LIMIT 10
  `;

  return [
    ...postResults,
    ...propostas.map((p) => ({
      type: 'proposta' as const,
      id: p.id,
      title: p.title,
      summary: p.summary,
      slug: p.slug,
      href: `/propostas/${p.slug}`,
    })),
  ];
}
