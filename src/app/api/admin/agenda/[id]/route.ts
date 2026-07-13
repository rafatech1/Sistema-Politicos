import { prisma } from '@/lib/prisma';
import { createEventoSchema, updateEventoSchema } from '@/lib/validations/evento.schema';
import { createItemHandlers } from '@/lib/api/crud-route-factory';

export const { GET, PATCH, DELETE } = createItemHandlers({
  entityType: 'Evento',
  delegate: prisma.evento,
  createSchema: createEventoSchema,
  updateSchema: updateEventoSchema,
  permission: 'content:read',
  writePermission: 'content:write',
  revalidateTags: ['home-eventos'],
});
