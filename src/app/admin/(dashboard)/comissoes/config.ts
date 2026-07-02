import type { FormFieldConfig } from '@/components/admin/resource-form';
import type { ResourceColumn } from '@/components/admin/resource-table';

export interface ComissaoRow {
  id: string;
  title: string;
  organization: string | null;
  order: number;
}

export const FIELDS: FormFieldConfig[] = [
  { name: 'title', label: 'Título', required: true },
  { name: 'organization', label: 'Organização' },
  { name: 'startDate', label: 'Data de início', type: 'date' },
  { name: 'endDate', label: 'Data de término (vazio = atual)', type: 'date' },
  { name: 'description', label: 'Descrição', type: 'textarea' },
  { name: 'order', label: 'Ordem', type: 'number' },
];

export const COLUMNS: ResourceColumn<ComissaoRow>[] = [
  { key: 'title', label: 'Título' },
  { key: 'organization', label: 'Organização', render: (item) => item.organization ?? '—' },
  { key: 'order', label: 'Ordem' },
];
