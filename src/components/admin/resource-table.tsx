'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { FaBoxOpen, FaSpinner, FaPen, FaTrashCan } from 'react-icons/fa6';

export interface ResourceColumn<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
}

export function ResourceTable<T extends { id: string }>({
  apiPath,
  columns,
  editHrefBase,
  newHref,
  newLabel = 'Novo',
  canWrite,
  emptyMessage = 'Nenhum registro encontrado.',
}: {
  apiPath: string;
  columns: ResourceColumn<T>[];
  editHrefBase: string;
  newHref?: string;
  newLabel?: string;
  canWrite: boolean;
  emptyMessage?: string;
}) {
  const [items, setItems] = useState<T[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError(null);
      const res = await fetch(apiPath);
      if (cancelled) return;
      if (!res.ok) {
        setError('Não foi possível carregar os dados.');
        return;
      }
      setItems(await res.json());
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [apiPath]);

  async function handleDelete(id: string) {
    if (!confirm('Remover este registro?')) return;
    const res = await fetch(`${apiPath}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems((prev) => prev?.filter((item) => item.id !== id) ?? null);
    } else {
      const body = await res.json().catch(() => ({}));
      alert(body.error ?? 'Erro ao remover.');
    }
  }

  return (
    <div className="space-y-4">
      {canWrite && newHref && (
        <div className="flex justify-end">
          <Link
            href={newHref}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
          >
            {newLabel}
          </Link>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3">
                  {col.label}
                </th>
              ))}
              {canWrite && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <tr key={item.id} className="border-t border-slate-100 transition-colors hover:bg-slate-50">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
                {canWrite && (
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`${editHrefBase}/${item.id}`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-primary hover:text-primary"
                      >
                        <FaPen size={11} />
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                      >
                        <FaTrashCan size={11} />
                        Remover
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {items && items.length === 0 && (
          <div className="flex flex-col items-center gap-2 p-12 text-center text-sm text-slate-400">
            <FaBoxOpen size={28} />
            <p>{emptyMessage}</p>
          </div>
        )}
        {!items && !error && (
          <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-400">
            <FaSpinner size={16} className="animate-spin" />
            Carregando…
          </div>
        )}
      </div>
    </div>
  );
}
