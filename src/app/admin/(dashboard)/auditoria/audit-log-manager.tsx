'use client';

import { Fragment, useEffect, useState } from 'react';
import { FaBoxOpen, FaSpinner } from 'react-icons/fa6';

interface AuditLogRow {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  beforeJson: unknown;
  afterJson: unknown;
  userEmailSnapshot: string | null;
  ipAddress: string | null;
  createdAt: string;
}

const ACTION_OPTIONS = [
  { value: 'CREATE', label: 'Criação' },
  { value: 'UPDATE', label: 'Atualização' },
  { value: 'DELETE', label: 'Remoção' },
  { value: 'LOGIN', label: 'Login' },
  { value: 'LOGIN_FAILED', label: 'Login falhou' },
  { value: 'LOGOUT', label: 'Logout' },
];

const ENTITY_TYPE_OPTIONS = [
  'Auth',
  'User',
  'SiteSettings',
  'Post',
  'Categoria',
  'Proposta',
  'EixoTematico',
  'ProjetoDeLei',
  'EmendaParlamentar',
  'Comissao',
  'BiografiaTimelineItem',
  'AchievementBadge',
  'BeliefValue',
  'Video',
  'InstagramHighlight',
  'Lead',
];

export function AuditLogManager() {
  const [logs, setLogs] = useState<AuditLogRow[] | null>(null);
  const [actionFilter, setActionFilter] = useState('ALL');
  const [entityTypeFilter, setEntityTypeFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const params = new URLSearchParams();
      if (actionFilter !== 'ALL') params.set('action', actionFilter);
      if (entityTypeFilter !== 'ALL') params.set('entityType', entityTypeFilter);

      const res = await fetch(`/api/admin/audit-logs?${params.toString()}`);
      if (cancelled) return;
      if (res.ok) setLogs(await res.json());
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [actionFilter, entityTypeFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <select
          value={entityTypeFilter}
          onChange={(e) => setEntityTypeFilter(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="ALL">Todas as entidades</option>
          {ENTITY_TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="ALL">Todas as ações</option>
          {ACTION_OPTIONS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      <div className="max-h-[70vh] overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 shadow-sm">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Usuário</th>
              <th className="px-4 py-3">Ação</th>
              <th className="px-4 py-3">Entidade</th>
              <th className="px-4 py-3">IP</th>
            </tr>
          </thead>
          <tbody>
            {logs?.map((log) => (
              <Fragment key={log.id}>
                <tr
                  className="cursor-pointer border-t border-slate-100 transition-colors hover:bg-slate-50"
                  onClick={() => setExpandedId((prev) => (prev === log.id ? null : log.id))}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                    {new Date(log.createdAt).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-4 py-3">{log.userEmailSnapshot ?? '—'}</td>
                  <td className="px-4 py-3">{ACTION_OPTIONS.find((a) => a.value === log.action)?.label ?? log.action}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {log.entityType} <span className="text-slate-400">#{log.entityId}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{log.ipAddress ?? '—'}</td>
                </tr>
                {expandedId === log.id && (log.beforeJson != null || log.afterJson != null) && (
                  <tr className="border-t border-slate-100 bg-slate-50">
                    <td colSpan={5} className="px-4 py-3">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Antes</p>
                          <pre className="max-h-64 overflow-auto rounded-md bg-white p-3 text-xs text-slate-700">
                            {log.beforeJson != null ? JSON.stringify(log.beforeJson, null, 2) : '—'}
                          </pre>
                        </div>
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Depois</p>
                          <pre className="max-h-64 overflow-auto rounded-md bg-white p-3 text-xs text-slate-700">
                            {log.afterJson != null ? JSON.stringify(log.afterJson, null, 2) : '—'}
                          </pre>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
        {logs && logs.length === 0 && (
          <div className="flex flex-col items-center gap-2 p-12 text-center text-sm text-slate-400">
            <FaBoxOpen size={28} />
            <p>Nenhum registro encontrado.</p>
          </div>
        )}
        {!logs && (
          <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-400">
            <FaSpinner size={16} className="animate-spin" />
            Carregando…
          </div>
        )}
      </div>
    </div>
  );
}
