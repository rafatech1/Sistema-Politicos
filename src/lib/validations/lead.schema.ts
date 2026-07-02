import { z } from 'zod';

export const createLeadSchema = z.object({
  type: z.enum(['VOLUNTEER', 'CONTACT']),
  name: z.string().min(2, 'Informe seu nome'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  message: z.string().min(1, 'Informe uma mensagem').optional(),
  city: z.string().optional(),
  consentLGPD: z.boolean().refine((v) => v === true, {
    message: 'É necessário aceitar o uso dos dados para prosseguir.',
  }),
  // Honeypot: campo escondido no formulário — só bots preenchem.
  website: z.string().optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

// Usado pelo painel admin: a única alteração permitida num lead é o status
// (o conteúdo em si vem do formulário público, não é editável).
export const updateLeadStatusSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'ARCHIVED', 'SPAM']),
});

export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;
