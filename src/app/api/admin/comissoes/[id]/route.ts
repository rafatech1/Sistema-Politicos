import { prisma } from '@/lib/prisma';
import { createComissaoSchema, updateComissaoSchema } from '@/lib/validations/comissao.schema';
import { createItemHandlers } from '@/lib/api/crud-route-factory';

export const { GET, PATCH, DELETE } = createItemHandlers({
  entityType: 'Comissao',
  delegate: prisma.comissao,
  createSchema: createComissaoSchema,
  updateSchema: updateComissaoSchema,
  permission: 'content:read',
  writePermission: 'content:write',
});
