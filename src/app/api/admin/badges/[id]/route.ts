import { prisma } from '@/lib/prisma';
import { createBadgeSchema, updateBadgeSchema } from '@/lib/validations/badge.schema';
import { createItemHandlers } from '@/lib/api/crud-route-factory';

export const { GET, PATCH, DELETE } = createItemHandlers({
  entityType: 'AchievementBadge',
  delegate: prisma.achievementBadge,
  createSchema: createBadgeSchema,
  updateSchema: updateBadgeSchema,
  permission: 'content:read',
  writePermission: 'content:write',
});
