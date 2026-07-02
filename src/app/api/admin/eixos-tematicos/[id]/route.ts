import { prisma } from '@/lib/prisma';
import { createEixoTematicoSchema, updateEixoTematicoSchema } from '@/lib/validations/eixo-tematico.schema';
import { createItemHandlers } from '@/lib/api/crud-route-factory';

export const { GET, PATCH, DELETE } = createItemHandlers({
  entityType: 'EixoTematico',
  delegate: prisma.eixoTematico,
  createSchema: createEixoTematicoSchema,
  updateSchema: updateEixoTematicoSchema,
  permission: 'content:read',
  writePermission: 'content:write',
});
