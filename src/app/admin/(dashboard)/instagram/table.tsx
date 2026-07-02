'use client';

import { ResourceTable } from '@/components/admin/resource-table';
import { COLUMNS, type InstagramHighlightRow } from './config';

export function InstagramTable({ canWrite }: { canWrite: boolean }) {
  return (
    <ResourceTable<InstagramHighlightRow>
      apiPath="/api/admin/instagram"
      editHrefBase="/admin/instagram"
      newHref="/admin/instagram/novo"
      canWrite={canWrite}
      columns={COLUMNS}
    />
  );
}
