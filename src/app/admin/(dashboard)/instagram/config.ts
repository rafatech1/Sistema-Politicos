import type { FormFieldConfig } from '@/components/admin/resource-form';
import type { ResourceColumn } from '@/components/admin/resource-table';

export interface InstagramHighlightRow {
  id: string;
  caption: string | null;
  postUrl: string;
  order: number;
}

export const FIELDS: FormFieldConfig[] = [
  { name: 'imageUrl', label: 'Imagem (URL)', required: true },
  { name: 'caption', label: 'Legenda', type: 'textarea' },
  { name: 'postUrl', label: 'URL do post no Instagram', required: true },
  { name: 'order', label: 'Ordem', type: 'number' },
];

export const COLUMNS: ResourceColumn<InstagramHighlightRow>[] = [
  { key: 'caption', label: 'Legenda', render: (item) => item.caption ?? '—' },
  { key: 'postUrl', label: 'URL' },
  { key: 'order', label: 'Ordem' },
];
