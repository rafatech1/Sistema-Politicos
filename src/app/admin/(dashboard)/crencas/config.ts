import type { FormFieldConfig } from '@/components/admin/resource-form';
import type { ResourceColumn } from '@/components/admin/resource-table';

export interface BeliefRow {
  id: string;
  title: string;
  tagline: string;
  isActive: boolean;
  order: number;
}

export const FIELDS: FormFieldConfig[] = [
  { name: 'title', label: 'Título', required: true },
  { name: 'tagline', label: 'Frase de efeito', required: true, helpText: 'Ex: "Cidadão livre. Bandido preso."' },
  { name: 'description', label: 'Descrição', type: 'textarea' },
  { name: 'icon', label: 'Ícone (emoji, opcional)' },
  { name: 'order', label: 'Ordem', type: 'number' },
  { name: 'isActive', label: 'Ativo', type: 'checkbox' },
];

export const COLUMNS: ResourceColumn<BeliefRow>[] = [
  { key: 'title', label: 'Título' },
  { key: 'tagline', label: 'Frase de efeito' },
  { key: 'isActive', label: 'Ativo', render: (item) => (item.isActive ? 'Sim' : 'Não') },
];
