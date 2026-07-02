import type { FormFieldConfig } from '@/components/admin/resource-form';
import type { ResourceColumn } from '@/components/admin/resource-table';

export interface ProjetoDeLeiRow {
  id: string;
  number: string;
  title: string;
  status: string;
  publishStatus: string;
  isFeatured: boolean;
}

const TRAMITACAO_OPTIONS = [
  { value: 'APRESENTADO', label: 'Apresentado' },
  { value: 'EM_TRAMITACAO', label: 'Em tramitação' },
  { value: 'APROVADO', label: 'Aprovado' },
  { value: 'REJEITADO', label: 'Rejeitado' },
  { value: 'ARQUIVADO', label: 'Arquivado' },
];

const PUBLISH_OPTIONS = [
  { value: 'DRAFT', label: 'Rascunho' },
  { value: 'PUBLISHED', label: 'Publicado' },
  { value: 'ARCHIVED', label: 'Arquivado' },
];

export const FIELDS: FormFieldConfig[] = [
  { name: 'number', label: 'Número (ex: 601/2023)', required: true },
  { name: 'title', label: 'Título', required: true },
  { name: 'slug', label: 'Slug (opcional — gerado automaticamente a partir do título)' },
  { name: 'summary', label: 'Resumo (exibido nas listagens)', type: 'textarea' },
  { name: 'content', label: 'Conteúdo (HTML)', type: 'textarea', required: true },
  { name: 'externalUrl', label: 'Link externo (Câmara/Assembleia)' },
  { name: 'coverImageUrl', label: 'Imagem de capa (URL)' },
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
  { key: 'status', label: 'Tramitação', render: (item) => TRAMITACAO_OPTIONS.find((s) => s.value === item.status)?.label ?? item.status },
  {
    key: 'publishStatus',
    label: 'Publicação',
    render: (item) => PUBLISH_OPTIONS.find((s) => s.value === item.publishStatus)?.label ?? item.publishStatus,
  },
  { key: 'isFeatured', label: 'Destaque', render: (item) => (item.isFeatured ? 'Sim' : 'Não') },
];
