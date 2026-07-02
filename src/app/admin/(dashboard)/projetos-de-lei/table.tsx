'use client';

import { ResourceTable } from '@/components/admin/resource-table';
import { COLUMNS, type ProjetoDeLeiRow } from './config';

export function ProjetosDeLeiTable({ canWrite }: { canWrite: boolean }) {
  return (
    <ResourceTable<ProjetoDeLeiRow>
      apiPath="/api/admin/projetos-de-lei"
      editHrefBase="/admin/projetos-de-lei"
      newHref="/admin/projetos-de-lei/novo"
      canWrite={canWrite}
      columns={COLUMNS}
    />
  );
}
