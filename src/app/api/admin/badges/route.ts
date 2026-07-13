import { prisma } from '@/lib/prisma';
import { createBadgeSchema, updateBadgeSchema } from '@/lib/validations/badge.schema';
import { createListCreateHandlers } from '@/lib/api/crud-route-factory';

export const { GET, POST } = createListCreateHandlers({
  entityType: 'AchievementBadge',
  delegate: prisma.achievementBadge,
  createSchema: createBadgeSchema,
  updateSchema: updateBadgeSchema,
  permission: 'content:read',
  writePermission: 'content:write',
  findManyArgs: { orderBy: { order: 'asc' } },
  revalidateTags: ['home-badges'],
});
