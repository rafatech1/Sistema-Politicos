import { prisma } from '@/lib/prisma';
import { createBeliefSchema, updateBeliefSchema } from '@/lib/validations/belief.schema';
import { createItemHandlers } from '@/lib/api/crud-route-factory';

export const { GET, PATCH, DELETE } = createItemHandlers({
  entityType: 'BeliefValue',
  delegate: prisma.beliefValue,
  createSchema: createBeliefSchema,
  updateSchema: updateBeliefSchema,
  permission: 'content:read',
  writePermission: 'content:write',
});
