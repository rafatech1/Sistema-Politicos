import { prisma } from '@/lib/prisma';
import { createEventoSchema, updateEventoSchema } from '@/lib/validations/evento.schema';
import { createListCreateHandlers } from '@/lib/api/crud-route-factory';

export const { GET, POST } = createListCreateHandlers({
  entityType: 'Evento',
  delegate: prisma.evento,
  createSchema: createEventoSchema,
  updateSchema: updateEventoSchema,
  permission: 'content:read',
  writePermission: 'content:write',
  findManyArgs: { orderBy: { startAt: 'desc' } },
  deriveSlug: (data) => data.title,
  revalidateTags: ['home-eventos'],
});
