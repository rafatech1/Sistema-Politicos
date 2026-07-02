import { prisma } from '@/lib/prisma';
import {
  createBiografiaTimelineItemSchema,
  updateBiografiaTimelineItemSchema,
} from '@/lib/validations/biografia-timeline.schema';
import { createListCreateHandlers } from '@/lib/api/crud-route-factory';

export const { GET, POST } = createListCreateHandlers({
  entityType: 'BiografiaTimelineItem',
  delegate: prisma.biografiaTimelineItem,
  createSchema: createBiografiaTimelineItemSchema,
  updateSchema: updateBiografiaTimelineItemSchema,
  permission: 'content:read',
  writePermission: 'content:write',
  findManyArgs: { orderBy: { order: 'asc' } },
});
