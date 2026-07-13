import { prisma } from '@/lib/prisma';
import { createProjetoDeLeiSchema, updateProjetoDeLeiSchema } from '@/lib/validations/projeto-de-lei.schema';
import { createListCreateHandlers } from '@/lib/api/crud-route-factory';

export const { GET, POST } = createListCreateHandlers({
  entityType: 'ProjetoDeLei',
  delegate: prisma.projetoDeLei,
  createSchema: createProjetoDeLeiSchema,
  updateSchema: updateProjetoDeLeiSchema,
  permission: 'content:read',
  writePermission: 'content:write',
  findManyArgs: { orderBy: { createdAt: 'desc' } },
  deriveSlug: (data) => data.title,
  publishGate: { field: 'publishStatus', publishedValues: ['PUBLISHED'] },
  revalidateTags: ['home-projetos-de-lei'],
});
