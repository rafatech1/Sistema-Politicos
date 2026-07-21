import type { FormFieldConfig } from '@/components/admin/resource-form';
import type { ResourceColumn } from '@/components/admin/resource-table';
import { Badge, type BadgeTone } from '@/components/admin/badge';

export interface PropostaRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  isFeatured: boolean;
  eixoTematico?: { name: string } | null;
}

const STATUS_OPTIONS: { value: string; label: string; tone: BadgeTone }[] = [
  { value: 'DRAFT', label: 'Rascunho', tone: 'gray' },
  { value: 'PUBLISHED', label: 'Publicado', tone: 'green' },
  { value: 'ARCHIVED', label: 'Arquivado', tone: 'amber' },
];

export function buildFields(eixos: { id: string; name: string }[]): FormFieldConfig[] {
  return [
    { name: 'title', label: 'Título', required: true },
    { name: 'slug', label: 'Slug (opcional — gerado automaticamente a partir do título)' },
    { name: 'summary', label: 'Resumo (exibido nas listagens)', type: 'textarea' },
    { name: 'content', label: 'Conteúdo', type: 'richtext', required: true },
    { name: 'coverImageUrl', label: 'Imagem de capa', type: 'image' },
    { name: 'eixoTematicoId', label: 'Eixo temático', type: 'select', options: eixos.map((e) => ({ value: e.id, label: e.name })) },
    { name: 'order', label: 'Ordem', type: 'number' },
    { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, helpText: 'Publicar exige permissão de administrador.' },
    { name: 'isFeatured', label: 'Destaque na Home', type: 'checkbox' },
  ];
}

export const COLUMNS: ResourceColumn<PropostaRow>[] = [
  { key: 'title', label: 'Título' },
  { key: 'eixoTematico', label: 'Eixo', render: (item) => item.eixoTematico?.name ?? '—' },
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
    render: (item) => <Badge tone={item.isFeatured ? 'accent' : 'gray'}>{item.isFeatured ? 'Sim' : 'Não'}</Badge>,
  },
];
