import type { FormFieldConfig } from '@/components/admin/resource-form';
import type { ResourceColumn } from '@/components/admin/resource-table';

export interface BadgeRow {
  id: string;
  icon: string | null;
  text: string;
  order: number;
}

export const FIELDS: FormFieldConfig[] = [
  { name: 'icon', label: 'Ícone (emoji, ex: 🏆)' },
  { name: 'text', label: 'Texto', required: true, helpText: 'Ex: "Deputado mais votado do Ceará em 2022"' },
  { name: 'order', label: 'Ordem', type: 'number' },
];

export const COLUMNS: ResourceColumn<BadgeRow>[] = [
  { key: 'icon', label: 'Ícone', render: (item) => item.icon ?? '—' },
  { key: 'text', label: 'Texto' },
  { key: 'order', label: 'Ordem' },
];
