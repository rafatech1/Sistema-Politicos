import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getCachedSessionUser } from '@/lib/auth/session.cached';
import { hasPermission } from '@/lib/auth/rbac';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { AdminShell } from './admin-shell';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCachedSessionUser();
  if (!user) redirect('/admin/login');

  const settings = await getCachedSiteSettings();

  return (
    <AdminShell
      candidateName={settings.candidateName}
      logoUrl={settings.logoUrl}
      mode={settings.mode}
      userName={user.name}
      userRole={user.role}
      canManageLeads={hasPermission(user.role, 'leads:manage')}
      canManageSettings={hasPermission(user.role, 'settings:write')}
      canManageUsers={hasPermission(user.role, 'users:manage')}
      canReadAudit={hasPermission(user.role, 'audit:read')}
    >
      {children}
    </AdminShell>
  );
}
