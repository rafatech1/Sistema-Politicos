import { prisma } from '@/lib/prisma';
import { createCategoriaSchema, updateCategoriaSchema } from '@/lib/validations/categoria.schema';
import { createItemHandlers } from '@/lib/api/crud-route-factory';

export const { GET, PATCH, DELETE } = createItemHandlers({
  entityType: 'Categoria',
  delegate: prisma.categoria,
  createSchema: createCategoriaSchema,
  updateSchema: updateCategoriaSchema,
  permission: 'content:read',
  writePermission: 'content:write',
});
