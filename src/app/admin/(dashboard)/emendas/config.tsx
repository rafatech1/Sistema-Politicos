import type { FormFieldConfig } from '@/components/admin/resource-form';
import type { ResourceColumn } from '@/components/admin/resource-table';
import { Badge, type BadgeTone } from '@/components/admin/badge';

export interface EmendaRow {
  id: string;
  value: string;
  area: string;
  municipio: string;
  status: string;
  year: number | null;
}

const STATUS_OPTIONS: { value: string; label: string; tone: BadgeTone }[] = [
  { value: 'EMPENHADA', label: 'Empenhada', tone: 'blue' },
  { value: 'EM_EXECUCAO', label: 'Em execução', tone: 'amber' },
  { value: 'PAGA', label: 'Paga', tone: 'green' },
  { value: 'CANCELADA', label: 'Cancelada', tone: 'red' },
];

export const FIELDS: FormFieldConfig[] = [
  { name: 'value', label: 'Valor (R$)', type: 'number', required: true },
  { name: 'area', label: 'Área (ex: Saúde, Educação)', required: true },
  { name: 'municipio', label: 'Município', required: true },
  { name: 'year', label: 'Ano', type: 'number' },
  { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
  { name: 'description', label: 'Descrição', type: 'textarea' },
];

function formatCurrency(value: string) {
  const n = Number(value);
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export const COLUMNS: ResourceColumn<EmendaRow>[] = [
  { key: 'value', label: 'Valor', render: (item) => formatCurrency(item.value) },
  { key: 'area', label: 'Área' },
  { key: 'municipio', label: 'Município' },
  { key: 'year', label: 'Ano' },
  {
    key: 'status',
    label: 'Status',
    render: (item) => {
      const opt = STATUS_OPTIONS.find((s) => s.value === item.status);
      return <Badge tone={opt?.tone ?? 'gray'}>{opt?.label ?? item.status}</Badge>;
    },
  },
];
