import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { AdminSidebar } from './admin-sidebar';
import { LogoutButton } from './logout-button';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar
        canManageLeads={hasPermission(user.role, 'leads:manage')}
        canManageSettings={hasPermission(user.role, 'settings:write')}
        canManageUsers={hasPermission(user.role, 'users:manage')}
      />

      <div className="flex-1">
        <header className="flex items-center justify-end gap-4 border-b border-slate-200 bg-white px-6 py-3 text-sm text-slate-500">
          <span>
            {user.name} · {user.role}
          </span>
          <LogoutButton />
        </header>
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
