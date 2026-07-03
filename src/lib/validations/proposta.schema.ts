import { z } from 'zod';
import { optionalEnum, optionalImagePath, optionalSlug } from '@/lib/validations/zod-helpers';

export const createPropostaSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  slug: optionalSlug,
  summary: z.string().optional().nullable(),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  coverImageUrl: optionalImagePath,
  status: optionalEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'], 'DRAFT'),
  isFeatured: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
  eixoTematicoId: z.string().optional().nullable().or(z.literal('')),
});

export const updatePropostaSchema = createPropostaSchema.partial();

export type CreatePropostaInput = z.infer<typeof createPropostaSchema>;
export type UpdatePropostaInput = z.infer<typeof updatePropostaSchema>;
