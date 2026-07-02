'use client';

import { ResourceTable } from '@/components/admin/resource-table';
import { COLUMNS, type ComissaoRow } from './config';

export function ComissoesTable({ canWrite }: { canWrite: boolean }) {
  return (
    <ResourceTable<ComissaoRow>
      apiPath="/api/admin/comissoes"
      editHrefBase="/admin/comissoes"
      newHref="/admin/comissoes/novo"
      canWrite={canWrite}
      columns={COLUMNS}
    />
  );
}
