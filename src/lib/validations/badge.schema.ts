import { z } from 'zod';

export const createBadgeSchema = z.object({
  icon: z.string().optional().nullable(),
  text: z.string().min(1, 'Texto é obrigatório'),
  order: z.coerce.number().int().default(0),
});

export const updateBadgeSchema = createBadgeSchema.partial();

export type CreateBadgeInput = z.infer<typeof createBadgeSchema>;
export type UpdateBadgeInput = z.infer<typeof updateBadgeSchema>;
