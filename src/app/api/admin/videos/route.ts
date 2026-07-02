import { prisma } from '@/lib/prisma';
import { createVideoSchema, updateVideoSchema } from '@/lib/validations/video.schema';
import { createListCreateHandlers } from '@/lib/api/crud-route-factory';

export const { GET, POST } = createListCreateHandlers({
  entityType: 'Video',
  delegate: prisma.video,
  createSchema: createVideoSchema,
  updateSchema: updateVideoSchema,
  permission: 'content:read',
  writePermission: 'content:write',
  findManyArgs: { orderBy: { order: 'asc' } },
});
