import { prisma } from '@/lib/prisma';
import { createComissaoSchema, updateComissaoSchema } from '@/lib/validations/comissao.schema';
import { createListCreateHandlers } from '@/lib/api/crud-route-factory';

export const { GET, POST } = createListCreateHandlers({
  entityType: 'Comissao',
  delegate: prisma.comissao,
  createSchema: createComissaoSchema,
  updateSchema: updateComissaoSchema,
  permission: 'content:read',
  writePermission: 'content:write',
  findManyArgs: { orderBy: { order: 'asc' } },
});
