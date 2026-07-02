import type { FormFieldConfig } from '@/components/admin/resource-form';
import type { ResourceColumn } from '@/components/admin/resource-table';

export interface EixoTematicoRow {
  id: string;
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
}

export const FIELDS: FormFieldConfig[] = [
  { name: 'name', label: 'Nome', required: true },
  { name: 'slug', label: 'Slug (opcional — gerado automaticamente a partir do nome)' },
  { name: 'description', label: 'Descrição', type: 'textarea' },
  { name: 'icon', label: 'Ícone (emoji ou texto curto)' },
  { name: 'color', label: 'Cor (hex)' },
  { name: 'order', label: 'Ordem', type: 'number' },
  { name: 'isActive', label: 'Ativo', type: 'checkbox' },
];

export const COLUMNS: ResourceColumn<EixoTematicoRow>[] = [
  { key: 'name', label: 'Nome' },
  { key: 'slug', label: 'Slug' },
  { key: 'order', label: 'Ordem' },
  { key: 'isActive', label: 'Ativo', render: (item) => (item.isActive ? 'Sim' : 'Não') },
];
