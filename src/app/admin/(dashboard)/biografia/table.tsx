'use client';

import { ResourceTable } from '@/components/admin/resource-table';
import { COLUMNS, type BiografiaItemRow } from './config';

export function BiografiaTable({ canWrite }: { canWrite: boolean }) {
  return (
    <ResourceTable<BiografiaItemRow>
      apiPath="/api/admin/biografia"
      editHrefBase="/admin/biografia"
      newHref="/admin/biografia/novo"
      canWrite={canWrite}
      columns={COLUMNS}
    />
  );
}
