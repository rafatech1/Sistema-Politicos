import { prisma } from '@/lib/prisma';
import { createCategoriaSchema, updateCategoriaSchema } from '@/lib/validations/categoria.schema';
import { createListCreateHandlers } from '@/lib/api/crud-route-factory';

export const { GET, POST } = createListCreateHandlers({
  entityType: 'Categoria',
  delegate: prisma.categoria,
  createSchema: createCategoriaSchema,
  updateSchema: updateCategoriaSchema,
  permission: 'content:read',
  writePermission: 'content:write',
  findManyArgs: { orderBy: { name: 'asc' } },
  deriveSlug: (data) => data.name,
});
