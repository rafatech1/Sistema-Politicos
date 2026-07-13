import { prisma } from '@/lib/prisma';
import {
  createInstagramHighlightSchema,
  updateInstagramHighlightSchema,
} from '@/lib/validations/instagram-highlight.schema';
import { createItemHandlers } from '@/lib/api/crud-route-factory';

export const { GET, PATCH, DELETE } = createItemHandlers({
  entityType: 'InstagramHighlight',
  delegate: prisma.instagramHighlight,
  createSchema: createInstagramHighlightSchema,
  updateSchema: updateInstagramHighlightSchema,
  permission: 'content:read',
  writePermission: 'content:write',
  revalidateTags: ['home-instagram'],
});
