import { prisma } from '@/lib/prisma';
import { createBeliefSchema, updateBeliefSchema } from '@/lib/validations/belief.schema';
import { createListCreateHandlers } from '@/lib/api/crud-route-factory';

export const { GET, POST } = createListCreateHandlers({
  entityType: 'BeliefValue',
  delegate: prisma.beliefValue,
  createSchema: createBeliefSchema,
  updateSchema: updateBeliefSchema,
  permission: 'content:read',
  writePermission: 'content:write',
  findManyArgs: { orderBy: { order: 'asc' } },
  revalidateTags: ['home-beliefs'],
});
