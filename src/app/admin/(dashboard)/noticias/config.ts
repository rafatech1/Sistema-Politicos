import type { FormFieldConfig } from '@/components/admin/resource-form';
import type { ResourceColumn } from '@/components/admin/resource-table';

export interface PostRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  isFeatured: boolean;
  category?: { name: string } | null;
}

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Rascunho' },
  { value: 'PUBLISHED', label: 'Publicado' },
  { value: 'ARCHIVED', label: 'Arquivado' },
];

export function buildFields(categories: { id: string; name: string }[]): FormFieldConfig[] {
  return [
    { name: 'title', label: 'Título', required: true },
    { name: 'slug', label: 'Slug (opcional — gerado automaticamente a partir do título)' },
    { name: 'excerpt', label: 'Resumo (exibido nas listagens)', type: 'textarea' },
    { name: 'content', label: 'Conteúdo (HTML)', type: 'textarea', required: true },
    { name: 'coverImageUrl', label: 'Imagem de capa (URL)' },
    { name: 'categoryId', label: 'Categoria', type: 'select', options: categories.map((c) => ({ value: c.id, label: c.name })) },
    { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, helpText: 'Publicar exige permissão de administrador.' },
    { name: 'isFeatured', label: 'Destaque na Home', type: 'checkbox' },
  ];
}

export const COLUMNS: ResourceColumn<PostRow>[] = [
  { key: 'title', label: 'Título' },
  { key: 'category', label: 'Categoria', render: (item) => item.category?.name ?? '—' },
  { key: 'status', label: 'Status', render: (item) => STATUS_OPTIONS.find((s) => s.value === item.status)?.label ?? item.status },
  { key: 'isFeatured', label: 'Destaque', render: (item) => (item.isFeatured ? 'Sim' : 'Não') },
];
