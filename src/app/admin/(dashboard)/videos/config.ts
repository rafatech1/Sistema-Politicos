import type { FormFieldConfig } from '@/components/admin/resource-form';
import type { ResourceColumn } from '@/components/admin/resource-table';

export interface VideoRow {
  id: string;
  title: string;
  youtubeUrl: string;
  order: number;
}

export const FIELDS: FormFieldConfig[] = [
  { name: 'title', label: 'Título', required: true },
  { name: 'youtubeUrl', label: 'URL do YouTube', required: true },
  { name: 'order', label: 'Ordem', type: 'number' },
];

export const COLUMNS: ResourceColumn<VideoRow>[] = [
  { key: 'title', label: 'Título' },
  { key: 'youtubeUrl', label: 'URL' },
  { key: 'order', label: 'Ordem' },
];
