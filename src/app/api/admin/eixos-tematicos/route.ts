import { prisma } from '@/lib/prisma';
import { createEixoTematicoSchema, updateEixoTematicoSchema } from '@/lib/validations/eixo-tematico.schema';
import { createListCreateHandlers } from '@/lib/api/crud-route-factory';

export const { GET, POST } = createListCreateHandlers({
  entityType: 'EixoTematico',
  delegate: prisma.eixoTematico,
  createSchema: createEixoTematicoSchema,
  updateSchema: updateEixoTematicoSchema,
  permission: 'content:read',
  writePermission: 'content:write',
  findManyArgs: { orderBy: { order: 'asc' } },
  deriveSlug: (data) => data.name,
});
