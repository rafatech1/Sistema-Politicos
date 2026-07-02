import { z } from 'zod';
import { optionalDate } from '@/lib/validations/zod-helpers';

export const createComissaoSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  organization: z.string().optional().nullable(),
  startDate: optionalDate,
  endDate: optionalDate,
  description: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
});

export const updateComissaoSchema = createComissaoSchema.partial();

export type CreateComissaoInput = z.infer<typeof createComissaoSchema>;
export type UpdateComissaoInput = z.infer<typeof updateComissaoSchema>;
