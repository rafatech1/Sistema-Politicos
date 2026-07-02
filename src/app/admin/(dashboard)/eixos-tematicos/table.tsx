'use client';

import { ResourceTable } from '@/components/admin/resource-table';
import { COLUMNS, type EixoTematicoRow } from './config';

export function EixosTematicosTable({ canWrite }: { canWrite: boolean }) {
  return (
    <ResourceTable<EixoTematicoRow>
      apiPath="/api/admin/eixos-tematicos"
      editHrefBase="/admin/eixos-tematicos"
      newHref="/admin/eixos-tematicos/novo"
      canWrite={canWrite}
      columns={COLUMNS}
    />
  );
}
