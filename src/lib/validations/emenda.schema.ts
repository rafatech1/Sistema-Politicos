import { z } from 'zod';
import { optionalEnum, optionalNumber } from '@/lib/validations/zod-helpers';

export const createEmendaSchema = z.object({
  value: z.coerce.number().positive('Informe um valor válido'),
  area: z.string().min(1, 'Área é obrigatória'),
  municipio: z.string().min(1, 'Município é obrigatório'),
  description: z.string().optional().nullable(),
  status: optionalEnum(['EMPENHADA', 'EM_EXECUCAO', 'PAGA', 'CANCELADA'], 'EMPENHADA'),
  year: optionalNumber,
});

export const updateEmendaSchema = createEmendaSchema.partial();

export type CreateEmendaInput = z.infer<typeof createEmendaSchema>;
export type UpdateEmendaInput = z.infer<typeof updateEmendaSchema>;
