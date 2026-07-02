'use client';

import { useEffect, useState } from 'react';

interface LeadRow {
  id: string;
  type: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

const TYPE_LABELS: Record<string, string> = { VOLUNTEER: 'Voluntário', CONTACT: 'Contato' };
const STATUS_OPTIONS = [
  { value: 'NEW', label: 'Novo' },
  { value: 'CONTACTED', label: 'Contatado' },
  { value: 'ARCHIVED', label: 'Arquivado' },
  { value: 'SPAM', label: 'Spam' },
];

export function LeadsManager() {
  const [leads, setLeads] = useState<LeadRow[] | null>(null);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const params = new URLSearchParams();
      if (typeFilter !== 'ALL') params.set('type', typeFilter);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      if (cancelled) return;
      if (res.ok) setLeads(await res.json());
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [typeFilter, statusFilter]);

  async function handleStatusChange(id: string, status: string) {
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setLeads((prev) => prev?.map((l) => (l.id === id ? updated : l)) ?? null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este lead?')) return;
    const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
    if (res.ok) setLeads((prev) => prev?.filter((l) => l.id !== id) ?? null);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          >
            <option value="ALL">Todos os tipos</option>
            <option value="VOLUNTEER">Voluntário</option>
            <option value="CONTACT">Contato</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          >
            <option value="ALL">Todos os status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <a
          href="/api/admin/leads/export"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Exportar CSV
        </a>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2">Data</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Contato</th>
              <th className="px-4 py-2">Mensagem</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {leads?.map((lead) => (
              <tr key={lead.id} className="border-t border-slate-100 align-top">
                <td className="whitespace-nowrap px-4 py-2 text-xs text-slate-500">
                  {new Date(lead.createdAt).toLocaleString('pt-BR')}
                </td>
                <td className="px-4 py-2">{TYPE_LABELS[lead.type] ?? lead.type}</td>
                <td className="px-4 py-2">{lead.name}</td>
                <td className="px-4 py-2 text-xs text-slate-600">
                  {lead.email}
                  {lead.email && lead.phone && <br />}
                  {lead.phone}
                </td>
                <td className="max-w-xs px-4 py-2 text-xs text-slate-600">{lead.message}</td>
                <td className="px-4 py-2">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => handleDelete(lead.id)} className="text-red-500 hover:text-red-700">
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads && leads.length === 0 && <p className="p-6 text-center text-sm text-slate-500">Nenhum lead encontrado.</p>}
        {!leads && <p className="p-6 text-center text-sm text-slate-500">Carregando…</p>}
      </div>
    </div>
  );
}
