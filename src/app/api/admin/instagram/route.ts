import { prisma } from '@/lib/prisma';
import {
  createInstagramHighlightSchema,
  updateInstagramHighlightSchema,
} from '@/lib/validations/instagram-highlight.schema';
import { createListCreateHandlers } from '@/lib/api/crud-route-factory';

export const { GET, POST } = createListCreateHandlers({
  entityType: 'InstagramHighlight',
  delegate: prisma.instagramHighlight,
  createSchema: createInstagramHighlightSchema,
  updateSchema: updateInstagramHighlightSchema,
  permission: 'content:read',
  writePermission: 'content:write',
  findManyArgs: { orderBy: { order: 'asc' } },
  revalidateTags: ['home-instagram'],
});
