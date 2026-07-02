'use client';

import { ResourceTable } from '@/components/admin/resource-table';
import { COLUMNS, type EmendaRow } from './config';

export function EmendasTable({ canWrite }: { canWrite: boolean }) {
  return (
    <ResourceTable<EmendaRow>
      apiPath="/api/admin/emendas"
      editHrefBase="/admin/emendas"
      newHref="/admin/emendas/novo"
      canWrite={canWrite}
      columns={COLUMNS}
    />
  );
}
