'use client';

import { ResourceTable } from '@/components/admin/resource-table';
import { COLUMNS, type BeliefRow } from './config';

export function CrencasTable({ canWrite }: { canWrite: boolean }) {
  return (
    <ResourceTable<BeliefRow>
      apiPath="/api/admin/crencas"
      editHrefBase="/admin/crencas"
      newHref="/admin/crencas/novo"
      canWrite={canWrite}
      columns={COLUMNS}
    />
  );
}
