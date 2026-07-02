-- CreateEnum
CREATE TYPE "SiteMode" AS ENUM ('CAMPAIGN', 'MANDATE');

-- CreateEnum
CREATE TYPE "TramitacaoStatus" AS ENUM ('APRESENTADO', 'EM_TRAMITACAO', 'APROVADO', 'REJEITADO', 'ARQUIVADO');

-- CreateEnum
CREATE TYPE "EmendaStatus" AS ENUM ('EMPENHADA', 'EM_EXECUCAO', 'PAGA', 'CANCELADA');

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "propostas" ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "site_settings" DROP COLUMN "heroVideoUrl",
ADD COLUMN     "aboutFullText" TEXT,
ADD COLUMN     "aboutShortText" TEXT,
ADD COLUMN     "aboutTagline" TEXT,
ADD COLUMN     "heroBackgroundImageUrl" TEXT,
ADD COLUMN     "homeSections" JSONB,
ADD COLUMN     "mode" "SiteMode" NOT NULL DEFAULT 'CAMPAIGN',
ADD COLUMN     "officeAddress" TEXT,
ADD COLUMN     "officeMapEmbedUrl" TEXT,
ADD COLUMN     "termsOfServiceText" TEXT;

-- CreateTable
CREATE TABLE "comissoes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "organization" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comissoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievement_badges" (
    "id" TEXT NOT NULL,
    "icon" TEXT,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "achievement_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "belief_values" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "belief_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instagram_highlights" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "postUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instagram_highlights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
-- Nota: sem coluna search_vector aqui de propósito — ela é criada na migration
-- seguinte já como coluna GERADA (STORED). Criá-la aqui como coluna comum e
-- "convertê-la" depois não funciona (Postgres não permite ALTER COLUMN para
-- adicionar expressão gerada numa coluna já existente).
CREATE TABLE "projetos_de_lei" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT NOT NULL,
    "status" "TramitacaoStatus" NOT NULL DEFAULT 'APRESENTADO',
    "externalUrl" TEXT,
    "coverImageUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "publishStatus" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projetos_de_lei_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emendas_parlamentares" (
    "id" TEXT NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "area" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "description" TEXT,
    "status" "EmendaStatus" NOT NULL DEFAULT 'EMPENHADA',
    "year" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emendas_parlamentares_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projetos_de_lei_slug_key" ON "projetos_de_lei"("slug");

-- CreateIndex
CREATE INDEX "projetos_de_lei_status_idx" ON "projetos_de_lei"("status");

-- CreateIndex
CREATE INDEX "projetos_de_lei_publishStatus_idx" ON "projetos_de_lei"("publishStatus");

-- CreateIndex
CREATE INDEX "emendas_parlamentares_area_idx" ON "emendas_parlamentares"("area");

-- CreateIndex
CREATE INDEX "emendas_parlamentares_municipio_idx" ON "emendas_parlamentares"("municipio");
