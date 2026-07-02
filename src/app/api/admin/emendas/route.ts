import { prisma } from '@/lib/prisma';
import { createEmendaSchema, updateEmendaSchema } from '@/lib/validations/emenda.schema';
import { createListCreateHandlers } from '@/lib/api/crud-route-factory';

export const { GET, POST } = createListCreateHandlers({
  entityType: 'EmendaParlamentar',
  delegate: prisma.emendaParlamentar,
  createSchema: createEmendaSchema,
  updateSchema: updateEmendaSchema,
  permission: 'content:read',
  writePermission: 'content:write',
  findManyArgs: { orderBy: { createdAt: 'desc' } },
});
