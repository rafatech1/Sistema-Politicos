import type { FormFieldConfig } from '@/components/admin/resource-form';
import type { ResourceColumn } from '@/components/admin/resource-table';

export interface BiografiaItemRow {
  id: string;
  year: number | null;
  title: string;
  order: number;
}

export const FIELDS: FormFieldConfig[] = [
  { name: 'year', label: 'Ano', type: 'number' },
  { name: 'date', label: 'Data exata (opcional)', type: 'date' },
  { name: 'title', label: 'Título', required: true },
  { name: 'description', label: 'Descrição', type: 'textarea' },
  { name: 'imageUrl', label: 'Imagem', type: 'image' },
  { name: 'order', label: 'Ordem', type: 'number' },
];

export const COLUMNS: ResourceColumn<BiografiaItemRow>[] = [
  { key: 'year', label: 'Ano', render: (item) => item.year ?? '—' },
  { key: 'title', label: 'Título' },
  { key: 'order', label: 'Ordem' },
];
