'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { Role, SiteMode } from '@prisma/client';
import type { IconType } from 'react-icons';
import {
  FaGaugeHigh,
  FaNewspaper,
  FaTags,
  FaLightbulb,
  FaLayerGroup,
  FaScaleBalanced,
  FaMoneyBillWave,
  FaUserGroup,
  FaClockRotateLeft,
  FaAward,
  FaHeart,
  FaYoutube,
  FaInstagram,
  FaInbox,
  FaGear,
  FaUsers,
  FaClipboardList,
  FaBars,
  FaXmark,
} from 'react-icons/fa6';
import { LogoutButton } from './logout-button';

interface NavItem {
  label: string;
  href: string;
  icon: IconType;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

function SidebarLink({ href, label, icon: Icon, onNavigate }: NavItem & { onNavigate: () => void }) {
  const pathname = usePathname();
  const active = href === '/admin' ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
        active ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={15} className="shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function AdminShell({
  candidateName,
  logoUrl,
  mode,
  userName,
  userRole,
  canManageLeads,
  canManageSettings,
  canManageUsers,
  canReadAudit,
  children,
}: {
  candidateName: string;
  logoUrl: string | null;
  mode: SiteMode;
  userName: string;
  userRole: Role;
  canManageLeads: boolean;
  canManageSettings: boolean;
  canManageUsers: boolean;
  canReadAudit: boolean;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Fecha a gaveta ao navegar (mobile).
  useEffect(() => setMobileOpen(false), [pathname]);

  const groups: NavGroup[] = [
    { label: 'Visão Geral', items: [{ label: 'Dashboard', href: '/admin', icon: FaGaugeHigh }] },
    {
      label: 'Conteúdo',
      items: [
        { label: 'Notícias', href: '/admin/noticias', icon: FaNewspaper },
        { label: 'Categorias', href: '/admin/categorias', icon: FaTags },
        { label: 'Propostas', href: '/admin/propostas', icon: FaLightbulb },
        { label: 'Eixos Temáticos', href: '/admin/eixos-tematicos', icon: FaLayerGroup },
        { label: 'Projetos de Lei', href: '/admin/projetos-de-lei', icon: FaScaleBalanced },
        { label: 'Emendas Parlamentares', href: '/admin/emendas', icon: FaMoneyBillWave },
        { label: 'Comissões', href: '/admin/comissoes', icon: FaUserGroup },
        { label: 'Biografia (linha do tempo)', href: '/admin/biografia', icon: FaClockRotateLeft },
        { label: 'Badges do Hero', href: '/admin/badges', icon: FaAward },
        { label: 'No que acredito', href: '/admin/crencas', icon: FaHeart },
        { label: 'Vídeos', href: '/admin/videos', icon: FaYoutube },
        { label: 'Instagram', href: '/admin/instagram', icon: FaInstagram },
      ],
    },
  ];

  if (canManageLeads) {
    groups.push({
      label: 'Leads',
      items: [{ label: 'Formulários recebidos', href: '/admin/leads', icon: FaInbox }],
    });
  }

  const settingsItems: NavItem[] = [];
  if (canManageSettings) settingsItems.push({ label: 'Configurações', href: '/admin/settings', icon: FaGear });
  if (canManageUsers) settingsItems.push({ label: 'Usuários', href: '/admin/users', icon: FaUsers });
  if (canReadAudit) settingsItems.push({ label: 'Auditoria', href: '/admin/auditoria', icon: FaClipboardList });
  if (settingsItems.length > 0) groups.push({ label: 'Administração', items: settingsItems });

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          aria-hidden
          className="fixed inset-0 z-40 bg-slate-900/40 sm:hidden"
        />
      )}

      <nav
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-out sm:static sm:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={candidateName}
                width={36}
                height={36}
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {candidateName.slice(0, 2).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold text-slate-900">{candidateName}</p>
              <p className="text-xs text-slate-400">{mode === 'MANDATE' ? 'Modo Mandato' : 'Modo Campanha'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Fechar menu"
            className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 sm:hidden"
          >
            <FaXmark size={16} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <SidebarLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    onNavigate={() => setMobileOpen(false)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-700">{userName}</p>
            <p className="text-xs text-slate-400">{userRole === 'ADMIN' ? 'Administrador' : 'Editor'}</p>
          </div>
          <LogoutButton />
        </div>
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
          >
            <FaBars size={18} />
          </button>
          <span className="truncate font-display text-sm font-semibold text-slate-900">{candidateName}</span>
        </div>

        <main className="mx-auto w-full max-w-5xl flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
