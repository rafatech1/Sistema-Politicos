import type { FormFieldConfig } from '@/components/admin/resource-form';
import type { ResourceColumn } from '@/components/admin/resource-table';
import { Badge, type BadgeTone } from '@/components/admin/badge';

export interface EventoRow {
  id: string;
  title: string;
  startAt: string;
  location: string | null;
  status: string;
  isPublic: boolean;
}

const STATUS_OPTIONS: { value: string; label: string; tone: BadgeTone }[] = [
  { value: 'SCHEDULED', label: 'Agendado', tone: 'blue' },
  { value: 'CANCELLED', label: 'Cancelado', tone: 'red' },
  { value: 'COMPLETED', label: 'Realizado', tone: 'green' },
];

export const FIELDS: FormFieldConfig[] = [
  { name: 'title', label: 'Título', required: true },
  { name: 'slug', label: 'Slug (opcional — gerado automaticamente a partir do título)' },
  { name: 'description', label: 'Descrição', type: 'textarea' },
  { name: 'startAt', label: 'Início', type: 'datetime', required: true },
  { name: 'endAt', label: 'Fim (opcional)', type: 'datetime' },
  { name: 'location', label: 'Local (ex: Praça do Ferreira)' },
  { name: 'address', label: 'Endereço completo' },
  { name: 'coverImageUrl', label: 'Imagem de capa', type: 'image' },
  { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
  { name: 'isPublic', label: 'Exibir no site público', type: 'checkbox' },
];

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export const COLUMNS: ResourceColumn<EventoRow>[] = [
  { key: 'title', label: 'Título' },
  { key: 'startAt', label: 'Data/hora', render: (item) => formatDateTime(item.startAt) },
  { key: 'location', label: 'Local', render: (item) => item.location ?? '—' },
  {
    key: 'status',
    label: 'Status',
    render: (item) => {
      const opt = STATUS_OPTIONS.find((s) => s.value === item.status);
      return <Badge tone={opt?.tone ?? 'gray'}>{opt?.label ?? item.status}</Badge>;
    },
  },
  {
    key: 'isPublic',
    label: 'Público',
    render: (item) => <Badge tone={item.isPublic ? 'green' : 'gray'}>{item.isPublic ? 'Sim' : 'Não'}</Badge>,
  },
];
