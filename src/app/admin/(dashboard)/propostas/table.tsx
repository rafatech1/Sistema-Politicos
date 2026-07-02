'use client';

import { ResourceTable } from '@/components/admin/resource-table';
import { COLUMNS, type PropostaRow } from './config';

export function PropostasTable({ canWrite }: { canWrite: boolean }) {
  return (
    <ResourceTable<PropostaRow>
      apiPath="/api/admin/propostas"
      editHrefBase="/admin/propostas"
      newHref="/admin/propostas/novo"
      canWrite={canWrite}
      columns={COLUMNS}
    />
  );
}
