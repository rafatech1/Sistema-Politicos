import type { FormFieldConfig } from '@/components/admin/resource-form';
import type { ResourceColumn } from '@/components/admin/resource-table';

export interface EmendaRow {
  id: string;
  value: string;
  area: string;
  municipio: string;
  status: string;
  year: number | null;
}

const STATUS_OPTIONS = [
  { value: 'EMPENHADA', label: 'Empenhada' },
  { value: 'EM_EXECUCAO', label: 'Em execução' },
  { value: 'PAGA', label: 'Paga' },
  { value: 'CANCELADA', label: 'Cancelada' },
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
  { key: 'status', label: 'Status', render: (item) => STATUS_OPTIONS.find((s) => s.value === item.status)?.label ?? item.status },
];
