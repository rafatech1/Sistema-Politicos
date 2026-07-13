import { prisma } from '@/lib/prisma';
import { createPostSchema, updatePostSchema } from '@/lib/validations/post.schema';
import { createListCreateHandlers } from '@/lib/api/crud-route-factory';

export const { GET, POST } = createListCreateHandlers({
  entityType: 'Post',
  delegate: prisma.post,
  createSchema: createPostSchema,
  updateSchema: updatePostSchema,
  permission: 'content:read',
  writePermission: 'content:write',
  findManyArgs: { orderBy: { createdAt: 'desc' }, include: { category: true } },
  deriveSlug: (data) => data.title,
  publishGate: { field: 'status', publishedValues: ['PUBLISHED'] },
  beforeSave: (data) => {
    if (data.status === 'PUBLISHED' && !data.publishedAt) data.publishedAt = new Date();
  },
  beforeCreate: (data, user) => {
    data.authorId = user.id;
  },
  revalidateTags: ['home-posts'],
});
