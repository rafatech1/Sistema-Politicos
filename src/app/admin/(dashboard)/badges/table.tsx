'use client';

import { ResourceTable } from '@/components/admin/resource-table';
import { COLUMNS, type BadgeRow } from './config';

export function BadgesTable({ canWrite }: { canWrite: boolean }) {
  return (
    <ResourceTable<BadgeRow>
      apiPath="/api/admin/badges"
      editHrefBase="/admin/badges"
      newHref="/admin/badges/novo"
      canWrite={canWrite}
      columns={COLUMNS}
    />
  );
}
