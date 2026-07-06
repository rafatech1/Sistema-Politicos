'use client';

import { ResourceTable } from '@/components/admin/resource-table';
import { COLUMNS, type EventoRow } from './config';

export function AgendaTable({ canWrite }: { canWrite: boolean }) {
  return (
    <ResourceTable<EventoRow>
      apiPath="/api/admin/agenda"
      editHrefBase="/admin/agenda"
      newHref="/admin/agenda/novo"
      canWrite={canWrite}
      columns={COLUMNS}
    />
  );
}
