import { z } from 'zod';
import { optionalDate, optionalEnum, optionalImagePath, optionalSlug } from '@/lib/validations/zod-helpers';

export const createEventoSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  slug: optionalSlug,
  description: z.string().optional().nullable(),
  startAt: z.coerce.date({ required_error: 'Data/hora de início é obrigatória' }),
  endAt: optionalDate,
  location: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  isPublic: z.boolean().default(true),
  status: optionalEnum(['SCHEDULED', 'CANCELLED', 'COMPLETED'], 'SCHEDULED'),
  coverImageUrl: optionalImagePath,
});

export const updateEventoSchema = createEventoSchema.partial();

export type CreateEventoInput = z.infer<typeof createEventoSchema>;
export type UpdateEventoInput = z.infer<typeof updateEventoSchema>;
