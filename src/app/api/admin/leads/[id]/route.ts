import { prisma } from '@/lib/prisma';
import { createLeadSchema, updateLeadStatusSchema } from '@/lib/validations/lead.schema';
import { createItemHandlers } from '@/lib/api/crud-route-factory';

export const { GET, PATCH, DELETE } = createItemHandlers({
  entityType: 'Lead',
  delegate: prisma.lead,
  createSchema: createLeadSchema,
  updateSchema: updateLeadStatusSchema,
  permission: 'leads:manage',
});
