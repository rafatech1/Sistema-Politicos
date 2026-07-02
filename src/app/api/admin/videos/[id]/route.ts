import { prisma } from '@/lib/prisma';
import { createVideoSchema, updateVideoSchema } from '@/lib/validations/video.schema';
import { createItemHandlers } from '@/lib/api/crud-route-factory';

export const { GET, PATCH, DELETE } = createItemHandlers({
  entityType: 'Video',
  delegate: prisma.video,
  createSchema: createVideoSchema,
  updateSchema: updateVideoSchema,
  permission: 'content:read',
  writePermission: 'content:write',
});
