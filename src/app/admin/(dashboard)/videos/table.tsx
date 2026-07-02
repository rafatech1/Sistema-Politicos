'use client';

import { ResourceTable } from '@/components/admin/resource-table';
import { COLUMNS, type VideoRow } from './config';

export function VideosTable({ canWrite }: { canWrite: boolean }) {
  return (
    <ResourceTable<VideoRow>
      apiPath="/api/admin/videos"
      editHrefBase="/admin/videos"
      newHref="/admin/videos/novo"
      canWrite={canWrite}
      columns={COLUMNS}
    />
  );
}
