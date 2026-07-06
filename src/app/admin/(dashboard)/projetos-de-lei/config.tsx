import type { FormFieldConfig } from '@/components/admin/resource-form';
import type { ResourceColumn } from '@/components/admin/resource-table';
import { Badge, type BadgeTone } from '@/components/admin/badge';

export interface ProjetoDeLeiRow {
  id: string;
  number: string;
  title: string;
  status: string;
  publishStatus: string;
  isFeatured: boolean;
}

const TRAMITACAO_OPTIONS: { value: string; label: string; tone: BadgeTone }[] = [
  { value: 'APRESENTADO', label: 'Apresentado', tone: 'gray' },
  { value: 'EM_TRAMITACAO', label: 'Em tramitação', tone: 'blue' },
  { value: 'APROVADO', label: 'Aprovado', tone: 'green' },
  { value: 'REJEITADO', label: 'Rejeitado', tone: 'red' },
  { value: 'ARQUIVADO', label: 'Arquivado', tone: 'amber' },
];

const PUBLISH_OPTIONS: { value: string; label: string; tone: BadgeTone }[] = [
  { value: 'DRAFT', label: 'Rascunho', tone: 'gray' },
  { value: 'PUBLISHED', label: 'Publicado', tone: 'green' },
  { value: 'ARCHIVED', label: 'Arquivado', tone: 'amber' },
];

export const FIELDS: FormFieldConfig[] = [
  { name: 'number', label: 'Número (ex: 601/2023)', required: true },
  { name: 'title', label: 'Título', required: true },
  { name: 'slug', label: 'Slug (opcional — gerado automaticamente a partir do título)' },
  { name: 'summary', label: 'Resumo (exibido nas listagens)', type: 'textarea' },
  { name: 'content', label: 'Conteúdo', type: 'richtext', required: true },
  { name: 'externalUrl', label: 'Link externo (Câmara/Assembleia)' },
  { name: 'coverImageUrl', label: 'Imagem de capa', type: 'image' },
  { name: 'status', label: 'Status de tramitação', type: 'select', options: TRAMITACAO_OPTIONS },
  { name: 'order', label: 'Ordem', type: 'number' },
  {
    name: 'publishStatus',
    label: 'Publicação',
    type: 'select',
    options: PUBLISH_OPTIONS,
    helpText: 'Publicar exige permissão de administrador.',
  },
  { name: 'isFeatured', label: 'Destaque na Home', type: 'checkbox' },
];

export const COLUMNS: ResourceColumn<ProjetoDeLeiRow>[] = [
  { key: 'number', label: 'Número' },
  { key: 'title', label: 'Título' },
  {
    key: 'status',
    label: 'Tramitação',
    render: (item) => {
      const opt = TRAMITACAO_OPTIONS.find((s) => s.value === item.status);
      return <Badge tone={opt?.tone ?? 'gray'}>{opt?.label ?? item.status}</Badge>;
    },
  },
  {
    key: 'publishStatus',
    label: 'Publicação',
    render: (item) => {
      const opt = PUBLISH_OPTIONS.find((s) => s.value === item.publishStatus);
      return <Badge tone={opt?.tone ?? 'gray'}>{opt?.label ?? item.publishStatus}</Badge>;
    },
  },
  {
    key: 'isFeatured',
    label: 'Destaque',
    render: (item) => <Badge tone={item.isFeatured ? 'blue' : 'gray'}>{item.isFeatured ? 'Sim' : 'Não'}</Badge>,
  },
];
