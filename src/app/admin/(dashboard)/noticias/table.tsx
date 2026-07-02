'use client';

import { ResourceTable } from '@/components/admin/resource-table';
import { COLUMNS, type PostRow } from './config';

export function NoticiasTable({ canWrite }: { canWrite: boolean }) {
  return (
    <ResourceTable<PostRow>
      apiPath="/api/admin/noticias"
      editHrefBase="/admin/noticias"
      newHref="/admin/noticias/novo"
      canWrite={canWrite}
      columns={COLUMNS}
    />
  );
}
