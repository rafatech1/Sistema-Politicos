'use client';

import { Fragment, useState, type FormEvent } from 'react';
import { FaTrashCan, FaKey } from 'react-icons/fa6';
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
  const [resetTargetId, setResetTargetId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSaving, setResetSaving] = useState(false);

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

  function openResetPassword(id: string) {
    setResetTargetId(id);
    setResetPassword('');
    setResetError(null);
  }

  async function handleResetPassword(e: FormEvent, u: UserRow) {
    e.preventDefault();
    setResetError(null);
    setResetSaving(true);

    try {
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: resetPassword }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setResetError(body.error ?? 'Erro ao redefinir senha.');
        return;
      }

      setResetTargetId(null);
      setResetPassword('');
    } finally {
      setResetSaving(false);
    }
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
              <Fragment key={u.id}>
                <tr className="border-t border-slate-100 transition-colors hover:bg-slate-50">
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.role === 'ADMIN' ? 'Administrador' : 'Editor'}</td>
                  <td className="px-4 py-3">
                    <Badge tone={u.isActive ? 'green' : 'gray'}>{u.isActive ? 'Ativo' : 'Inativo'}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openResetPassword(u.id)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-primary hover:text-primary"
                      >
                        <FaKey size={11} />
                        Redefinir senha
                      </button>
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
                {resetTargetId === u.id && (
                  <tr className="border-t border-slate-100 bg-slate-50">
                    <td colSpan={5} className="px-4 py-3">
                      <form
                        onSubmit={(e) => handleResetPassword(e, u)}
                        className="flex flex-wrap items-center gap-2"
                      >
                        <span className="text-sm text-slate-600">Nova senha para {u.name}:</span>
                        <input
                          required
                          type="password"
                          autoFocus
                          value={resetPassword}
                          onChange={(e) => setResetPassword(e.target.value)}
                          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                          type="submit"
                          disabled={resetSaving}
                          className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
                        >
                          {resetSaving ? 'Salvando…' : 'Salvar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setResetTargetId(null)}
                          className="rounded-md border border-slate-200 px-4 py-1.5 text-sm text-slate-600 hover:border-slate-300"
                        >
                          Cancelar
                        </button>
                        {resetError && <p className="w-full text-sm text-red-600">{resetError}</p>}
                      </form>
                    </td>
                  </tr>
                )}
              </Fragment>
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
