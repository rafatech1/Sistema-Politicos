import { prisma } from '@/lib/prisma';
import { createEmendaSchema, updateEmendaSchema } from '@/lib/validations/emenda.schema';
import { createItemHandlers } from '@/lib/api/crud-route-factory';

export const { GET, PATCH, DELETE } = createItemHandlers({
  entityType: 'EmendaParlamentar',
  delegate: prisma.emendaParlamentar,
  createSchema: createEmendaSchema,
  updateSchema: updateEmendaSchema,
  permission: 'content:read',
  writePermission: 'content:write',
});
