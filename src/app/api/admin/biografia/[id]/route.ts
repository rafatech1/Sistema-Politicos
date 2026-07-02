import { prisma } from '@/lib/prisma';
import {
  createBiografiaTimelineItemSchema,
  updateBiografiaTimelineItemSchema,
} from '@/lib/validations/biografia-timeline.schema';
import { createItemHandlers } from '@/lib/api/crud-route-factory';

export const { GET, PATCH, DELETE } = createItemHandlers({
  entityType: 'BiografiaTimelineItem',
  delegate: prisma.biografiaTimelineItem,
  createSchema: createBiografiaTimelineItemSchema,
  updateSchema: updateBiografiaTimelineItemSchema,
  permission: 'content:read',
  writePermission: 'content:write',
});
