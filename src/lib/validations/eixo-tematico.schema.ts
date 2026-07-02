import { z } from 'zod';
import { optionalSlug } from '@/lib/validations/zod-helpers';

export const createEixoTematicoSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: optionalSlug,
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const updateEixoTematicoSchema = createEixoTematicoSchema.partial();

export type CreateEixoTematicoInput = z.infer<typeof createEixoTematicoSchema>;
export type UpdateEixoTematicoInput = z.infer<typeof updateEixoTematicoSchema>;
