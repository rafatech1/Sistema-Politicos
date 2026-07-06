import type { FormFieldConfig } from '@/components/admin/resource-form';
import type { ResourceColumn } from '@/components/admin/resource-table';
import { Badge, type BadgeTone } from '@/components/admin/badge';

export interface PostRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  isFeatured: boolean;
  category?: { name: string } | null;
}

const STATUS_OPTIONS: { value: string; label: string; tone: BadgeTone }[] = [
  { value: 'DRAFT', label: 'Rascunho', tone: 'gray' },
  { value: 'PUBLISHED', label: 'Publicado', tone: 'green' },
  { value: 'ARCHIVED', label: 'Arquivado', tone: 'amber' },
];

export function buildFields(categories: { id: string; name: string }[]): FormFieldConfig[] {
  return [
    { name: 'title', label: 'Título', required: true },
    { name: 'slug', label: 'Slug (opcional — gerado automaticamente a partir do título)' },
    { name: 'excerpt', label: 'Resumo (exibido nas listagens)', type: 'textarea' },
    { name: 'content', label: 'Conteúdo', type: 'richtext', required: true },
    { name: 'coverImageUrl', label: 'Imagem de capa', type: 'image' },
    { name: 'categoryId', label: 'Categoria', type: 'select', options: categories.map((c) => ({ value: c.id, label: c.name })) },
    { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, helpText: 'Publicar exige permissão de administrador.' },
    { name: 'isFeatured', label: 'Destaque na Home', type: 'checkbox' },
  ];
}

export const COLUMNS: ResourceColumn<PostRow>[] = [
  { key: 'title', label: 'Título' },
  { key: 'category', label: 'Categoria', render: (item) => item.category?.name ?? '—' },
  {
    key: 'status',
    label: 'Status',
    render: (item) => {
      const opt = STATUS_OPTIONS.find((s) => s.value === item.status);
      return <Badge tone={opt?.tone ?? 'gray'}>{opt?.label ?? item.status}</Badge>;
    },
  },
  {
    key: 'isFeatured',
    label: 'Destaque',
    render: (item) => <Badge tone={item.isFeatured ? 'blue' : 'gray'}>{item.isFeatured ? 'Sim' : 'Não'}</Badge>,
  },
];
