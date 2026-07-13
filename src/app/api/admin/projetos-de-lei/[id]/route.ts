import { prisma } from '@/lib/prisma';
import { createProjetoDeLeiSchema, updateProjetoDeLeiSchema } from '@/lib/validations/projeto-de-lei.schema';
import { createItemHandlers } from '@/lib/api/crud-route-factory';

export const { GET, PATCH, DELETE } = createItemHandlers({
  entityType: 'ProjetoDeLei',
  delegate: prisma.projetoDeLei,
  createSchema: createProjetoDeLeiSchema,
  updateSchema: updateProjetoDeLeiSchema,
  permission: 'content:read',
  writePermission: 'content:write',
  publishGate: { field: 'publishStatus', publishedValues: ['PUBLISHED'] },
  revalidateTags: ['home-projetos-de-lei'],
});
