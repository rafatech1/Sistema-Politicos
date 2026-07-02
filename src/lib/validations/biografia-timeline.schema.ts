import { z } from 'zod';
import { optionalDate, optionalNumber } from '@/lib/validations/zod-helpers';

export const createBiografiaTimelineItemSchema = z.object({
  year: optionalNumber,
  date: optionalDate,
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable().or(z.literal('')),
  order: z.coerce.number().int().default(0),
});

export const updateBiografiaTimelineItemSchema = createBiografiaTimelineItemSchema.partial();

export type CreateBiografiaTimelineItemInput = z.infer<typeof createBiografiaTimelineItemSchema>;
export type UpdateBiografiaTimelineItemInput = z.infer<typeof updateBiografiaTimelineItemSchema>;
