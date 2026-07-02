'use client';

import { ResourceTable } from '@/components/admin/resource-table';
import { COLUMNS, type CategoriaRow } from './config';

export function CategoriasTable({ canWrite }: { canWrite: boolean }) {
  return (
    <ResourceTable<CategoriaRow>
      apiPath="/api/admin/categorias"
      editHrefBase="/admin/categorias"
      newHref="/admin/categorias/novo"
      canWrite={canWrite}
      columns={COLUMNS}
    />
  );
}
