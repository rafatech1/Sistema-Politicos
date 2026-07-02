'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';

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
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            {newLabel}
          </Link>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-2">
                  {col.label}
                </th>
              ))}
              {canWrite && <th className="px-4 py-2" />}
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2">
                    {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
                {canWrite && (
                  <td className="space-x-3 px-4 py-2 text-right">
                    <Link href={`${editHrefBase}/${item.id}`} className="text-slate-500 hover:text-slate-900">
                      Editar
                    </Link>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                      Remover
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {items && items.length === 0 && <p className="p-6 text-center text-sm text-slate-500">{emptyMessage}</p>}
        {!items && !error && <p className="p-6 text-center text-sm text-slate-500">Carregando…</p>}
      </div>
    </div>
  );
}
