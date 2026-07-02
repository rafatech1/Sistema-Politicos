-- DropIndex
DROP INDEX "posts_search_vector_idx";

-- DropIndex
DROP INDEX "propostas_search_vector_idx";

-- AlterTable
ALTER TABLE "site_settings" ADD COLUMN     "heroVideoUrl" TEXT,
ALTER COLUMN "primaryColor" SET DEFAULT '#0033FF',
ALTER COLUMN "secondaryColor" SET DEFAULT '#33FFFF',
ALTER COLUMN "accentColor" SET DEFAULT '#FFCC00';
