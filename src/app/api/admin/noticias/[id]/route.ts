import { prisma } from '@/lib/prisma';
import { createPostSchema, updatePostSchema } from '@/lib/validations/post.schema';
import { createItemHandlers } from '@/lib/api/crud-route-factory';

export const { GET, PATCH, DELETE } = createItemHandlers({
  entityType: 'Post',
  delegate: prisma.post,
  createSchema: createPostSchema,
  updateSchema: updatePostSchema,
  permission: 'content:read',
  writePermission: 'content:write',
  publishGate: { field: 'status', publishedValues: ['PUBLISHED'] },
  beforeSave: (data) => {
    if (data.status === 'PUBLISHED' && !data.publishedAt) data.publishedAt = new Date();
  },
});
