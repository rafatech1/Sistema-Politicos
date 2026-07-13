import { prisma } from '@/lib/prisma';
import { createPropostaSchema, updatePropostaSchema } from '@/lib/validations/proposta.schema';
import { createItemHandlers } from '@/lib/api/crud-route-factory';

export const { GET, PATCH, DELETE } = createItemHandlers({
  entityType: 'Proposta',
  delegate: prisma.proposta,
  createSchema: createPropostaSchema,
  updateSchema: updatePropostaSchema,
  permission: 'content:read',
  writePermission: 'content:write',
  publishGate: { field: 'status', publishedValues: ['PUBLISHED'] },
  beforeSave: (data) => {
    if (data.status === 'PUBLISHED' && !data.publishedAt) data.publishedAt = new Date();
  },
  revalidateTags: ['home-propostas'],
});
