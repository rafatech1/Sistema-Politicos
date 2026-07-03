import { z } from 'zod';
import { imagePath } from '@/lib/validations/zod-helpers';

export const createInstagramHighlightSchema = z.object({
  imageUrl: imagePath,
  caption: z.string().optional().nullable(),
  postUrl: z.string().url('Informe uma URL válida do post'),
  order: z.coerce.number().int().default(0),
});

export const updateInstagramHighlightSchema = createInstagramHighlightSchema.partial();

export type CreateInstagramHighlightInput = z.infer<typeof createInstagramHighlightSchema>;
export type UpdateInstagramHighlightInput = z.infer<typeof updateInstagramHighlightSchema>;
