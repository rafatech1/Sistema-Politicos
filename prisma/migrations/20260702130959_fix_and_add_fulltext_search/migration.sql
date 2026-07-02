-- Corrige um bug da migration add_fulltext_search anterior: como o comando
-- usava "ADD COLUMN IF NOT EXISTS", e a coluna search_vector já existia
-- (criada como coluna comum pela migration init), o ALTER virou um no-op
-- silencioso — a coluna nunca foi convertida para GERADA (STORED). Corrige
-- em propostas/posts e cria a coluna gerada em projetos_de_lei (nova, então
-- sem esse problema).

ALTER TABLE "propostas" DROP COLUMN IF EXISTS search_vector;
ALTER TABLE "propostas" ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('portuguese', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(content, ''))
  ) STORED;
CREATE INDEX IF NOT EXISTS propostas_search_vector_idx ON "propostas" USING GIN (search_vector);

ALTER TABLE "posts" DROP COLUMN IF EXISTS search_vector;
ALTER TABLE "posts" ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('portuguese', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, ''))
  ) STORED;
CREATE INDEX IF NOT EXISTS posts_search_vector_idx ON "posts" USING GIN (search_vector);

ALTER TABLE "projetos_de_lei" ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('portuguese', coalesce(title, '') || ' ' || coalesce("number", '') || ' ' || coalesce(summary, '') || ' ' || coalesce(content, ''))
  ) STORED;
CREATE INDEX IF NOT EXISTS projetos_de_lei_search_vector_idx ON "projetos_de_lei" USING GIN (search_vector);
