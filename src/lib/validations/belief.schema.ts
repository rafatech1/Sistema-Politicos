import { z } from 'zod';

export const createBeliefSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  tagline: z.string().min(1, 'Frase de efeito é obrigatória'),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const updateBeliefSchema = createBeliefSchema.partial();

export type CreateBeliefInput = z.infer<typeof createBeliefSchema>;
export type UpdateBeliefInput = z.infer<typeof updateBeliefSchema>;
