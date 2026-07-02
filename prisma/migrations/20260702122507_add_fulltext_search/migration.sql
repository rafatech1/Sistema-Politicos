-- Full-text search (Postgres nativo, dicionário "portuguese") para Propostas e Posts.
-- Colunas geradas (STORED) se automantêm sem necessidade de trigger.
-- O Prisma Client ignora estas colunas (Unsupported("tsvector") no schema.prisma);
-- consultas de busca devem usar prisma.$queryRaw com "search_vector @@ plainto_tsquery('portuguese', $1)".
-- NUNCA rode `prisma db push` nestas tabelas — sempre migrations.

ALTER TABLE "propostas" ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('portuguese', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(content, ''))
  ) STORED;
CREATE INDEX IF NOT EXISTS propostas_search_vector_idx ON "propostas" USING GIN (search_vector);

ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('portuguese', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, ''))
  ) STORED;
CREATE INDEX IF NOT EXISTS posts_search_vector_idx ON "posts" USING GIN (search_vector);
