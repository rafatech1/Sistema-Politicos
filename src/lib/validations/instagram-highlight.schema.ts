import { z } from 'zod';

export const createInstagramHighlightSchema = z.object({
  imageUrl: z.string().url('Informe uma URL de imagem válida'),
  caption: z.string().optional().nullable(),
  postUrl: z.string().url('Informe uma URL válida do post'),
  order: z.coerce.number().int().default(0),
});

export const updateInstagramHighlightSchema = createInstagramHighlightSchema.partial();

export type CreateInstagramHighlightInput = z.infer<typeof createInstagramHighlightSchema>;
export type UpdateInstagramHighlightInput = z.infer<typeof updateInstagramHighlightSchema>;
