import { prisma } from '@/lib/prisma';
import { createPropostaSchema, updatePropostaSchema } from '@/lib/validations/proposta.schema';
import { createListCreateHandlers } from '@/lib/api/crud-route-factory';

export const { GET, POST } = createListCreateHandlers({
  entityType: 'Proposta',
  delegate: prisma.proposta,
  createSchema: createPropostaSchema,
  updateSchema: updatePropostaSchema,
  permission: 'content:read',
  writePermission: 'content:write',
  findManyArgs: { orderBy: { order: 'asc' }, include: { eixoTematico: true } },
  deriveSlug: (data) => data.title,
  publishGate: { field: 'status', publishedValues: ['PUBLISHED'] },
  beforeSave: (data) => {
    if (data.status === 'PUBLISHED' && !data.publishedAt) data.publishedAt = new Date();
  },
  beforeCreate: (data, user) => {
    data.authorId = user.id;
  },
  revalidateTags: ['home-propostas'],
});
