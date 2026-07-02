import { z } from 'zod';

export const createVideoSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  youtubeUrl: z.string().url('Informe uma URL válida do YouTube'),
  order: z.coerce.number().int().default(0),
});

export const updateVideoSchema = createVideoSchema.partial();

export type CreateVideoInput = z.infer<typeof createVideoSchema>;
export type UpdateVideoInput = z.infer<typeof updateVideoSchema>;
