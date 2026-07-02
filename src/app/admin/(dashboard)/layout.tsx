import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { LogoutButton } from './logout-button';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-700">
            <Link href="/admin">Dashboard</Link>
            {hasPermission(user.role, 'settings:write') && (
              <Link href="/admin/settings">Configurações</Link>
            )}
            {hasPermission(user.role, 'users:manage') && <Link href="/admin/users">Usuários</Link>}
          </nav>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>
              {user.name} · {user.role}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
