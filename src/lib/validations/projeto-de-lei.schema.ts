import { z } from 'zod';
import { optionalEnum, optionalImagePath, optionalSlug } from '@/lib/validations/zod-helpers';

export const createProjetoDeLeiSchema = z.object({
  number: z.string().min(1, 'Número é obrigatório'),
  title: z.string().min(1, 'Título é obrigatório'),
  slug: optionalSlug,
  summary: z.string().optional().nullable(),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  status: optionalEnum(['APRESENTADO', 'EM_TRAMITACAO', 'APROVADO', 'REJEITADO', 'ARQUIVADO'], 'APRESENTADO'),
  externalUrl: z.string().url().optional().nullable().or(z.literal('')),
  coverImageUrl: optionalImagePath,
  isFeatured: z.boolean().default(false),
  publishStatus: optionalEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'], 'DRAFT'),
  order: z.coerce.number().int().default(0),
});

export const updateProjetoDeLeiSchema = createProjetoDeLeiSchema.partial();

export type CreateProjetoDeLeiInput = z.infer<typeof createProjetoDeLeiSchema>;
export type UpdateProjetoDeLeiInput = z.infer<typeof updateProjetoDeLeiSchema>;
