'use client';

import { useState, type FormEvent } from 'react';
import { FaTrashCan } from 'react-icons/fa6';
import { Badge } from '@/components/admin/badge';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR';
  isActive: boolean;
}

export function UsersManager({
  initialUsers,
  currentUserId,
}: {
  initialUsers: UserRow[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [form, setForm] = useState<{
    name: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'EDITOR';
  }>({ name: '', email: '', password: '', role: 'EDITOR' });
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setCreating(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const body = await res.json();

      if (!res.ok) {
        setError(body.error ?? 'Erro ao criar usuário.');
        return;
      }

      setUsers((prev) => [...prev, body]);
      setForm({ name: '', email: '', password: '', role: 'EDITOR' });
    } finally {
      setCreating(false);
    }
  }

  async function handleToggleActive(u: UserRow) {
    const res = await fetch(`/api/admin/users/${u.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !u.isActive }),
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers((prev) => prev.map((x) => (x.id === u.id ? updated : x)));
    }
  }

  async function handleDelete(u: UserRow) {
    if (!confirm(`Remover o usuário ${u.name}?`)) return;
    const res = await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE' });
    if (res.ok) setUsers((prev) => prev.filter((x) => x.id !== u.id));
  }

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Papel</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-100 transition-colors hover:bg-slate-50">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.role === 'ADMIN' ? 'Administrador' : 'Editor'}</td>
                <td className="px-4 py-3">
                  <Badge tone={u.isActive ? 'green' : 'gray'}>{u.isActive ? 'Ativo' : 'Inativo'}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggleActive(u)}
                      className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-primary hover:text-primary"
                    >
                      {u.isActive ? 'Desativar' : 'Ativar'}
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
                      disabled={u.id === currentUserId}
                      className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-30"
                    >
                      <FaTrashCan size={11} />
                      Remover
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form
        onSubmit={handleCreate}
        className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-white p-6 sm:grid-cols-2"
      >
        <h2 className="col-span-full font-semibold text-slate-900">Adicionar usuário</h2>

        <input
          required
          placeholder="Nome"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <input
          required
          type="email"
          placeholder="E-mail"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <input
          required
          type="password"
          placeholder="Senha provisória"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <select
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as 'ADMIN' | 'EDITOR' }))}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="EDITOR">Editor</option>
          <option value="ADMIN">Admin</option>
        </select>

        {error && <p className="col-span-full text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={creating}
          className="col-span-full w-fit rounded-md bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
        >
          {creating ? 'Criando…' : 'Criar usuário'}
        </button>
      </form>
    </div>
  );
}
