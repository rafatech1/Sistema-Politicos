import type { FormFieldConfig } from '@/components/admin/resource-form';
import type { ResourceColumn } from '@/components/admin/resource-table';

export interface CategoriaRow {
  id: string;
  name: string;
  slug: string;
  type: string;
}

export const FIELDS: FormFieldConfig[] = [
  { name: 'name', label: 'Nome', required: true },
  { name: 'slug', label: 'Slug (opcional — gerado automaticamente a partir do nome)' },
  {
    name: 'type',
    label: 'Tipo',
    type: 'select',
    options: [
      { value: 'NOTICIA', label: 'Notícia' },
      { value: 'PROJETO', label: 'Projeto' },
      { value: 'GERAL', label: 'Geral' },
    ],
  },
  { name: 'description', label: 'Descrição', type: 'textarea' },
];

export const COLUMNS: ResourceColumn<CategoriaRow>[] = [
  { key: 'name', label: 'Nome' },
  { key: 'slug', label: 'Slug' },
  { key: 'type', label: 'Tipo' },
];
