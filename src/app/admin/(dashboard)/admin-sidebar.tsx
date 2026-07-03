'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavGroup {
  label: string;
  items: { label: string; href: string }[];
}

function SidebarLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = href === '/admin' ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`block rounded-md px-3 py-1.5 text-sm ${
        active ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {label}
    </Link>
  );
}

export function AdminSidebar({
  canManageLeads,
  canManageSettings,
  canManageUsers,
  canReadAudit,
}: {
  canManageLeads: boolean;
  canManageSettings: boolean;
  canManageUsers: boolean;
  canReadAudit: boolean;
}) {
  const groups: NavGroup[] = [
    { label: 'Visão Geral', items: [{ label: 'Dashboard', href: '/admin' }] },
    {
      label: 'Conteúdo',
      items: [
        { label: 'Notícias', href: '/admin/noticias' },
        { label: 'Categorias', href: '/admin/categorias' },
        { label: 'Propostas', href: '/admin/propostas' },
        { label: 'Eixos Temáticos', href: '/admin/eixos-tematicos' },
        { label: 'Projetos de Lei', href: '/admin/projetos-de-lei' },
        { label: 'Emendas Parlamentares', href: '/admin/emendas' },
        { label: 'Comissões', href: '/admin/comissoes' },
        { label: 'Biografia (linha do tempo)', href: '/admin/biografia' },
        { label: 'Badges do Hero', href: '/admin/badges' },
        { label: 'No que acredito', href: '/admin/crencas' },
        { label: 'Vídeos', href: '/admin/videos' },
        { label: 'Instagram', href: '/admin/instagram' },
      ],
    },
  ];

  if (canManageLeads) {
    groups.push({ label: 'Leads', items: [{ label: 'Formulários recebidos', href: '/admin/leads' }] });
  }

  const settingsItems: { label: string; href: string }[] = [];
  if (canManageSettings) settingsItems.push({ label: 'Configurações', href: '/admin/settings' });
  if (canManageUsers) settingsItems.push({ label: 'Usuários', href: '/admin/users' });
  if (canReadAudit) settingsItems.push({ label: 'Auditoria', href: '/admin/auditoria' });
  if (settingsItems.length > 0) groups.push({ label: 'Administração', items: settingsItems });

  return (
    <nav className="w-64 shrink-0 space-y-6 border-r border-slate-200 bg-white p-4">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{group.label}</p>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <SidebarLink key={item.href} href={item.href} label={item.label} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
