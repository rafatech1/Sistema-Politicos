import { z } from 'zod';
import { optionalEnum, optionalSlug } from '@/lib/validations/zod-helpers';

export const createCategoriaSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: optionalSlug,
  type: optionalEnum(['NOTICIA', 'PROJETO', 'GERAL'], 'NOTICIA'),
  description: z.string().optional().nullable(),
});

export const updateCategoriaSchema = createCategoriaSchema.partial();

export type CreateCategoriaInput = z.infer<typeof createCategoriaSchema>;
export type UpdateCategoriaInput = z.infer<typeof updateCategoriaSchema>;
