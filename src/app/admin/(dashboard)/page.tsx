import type { IconType } from 'react-icons';
import { FaNewspaper, FaLightbulb, FaScaleBalanced, FaInbox, FaUsers } from 'react-icons/fa6';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { AdminPageHeader } from '@/components/admin/page-header';

function StatTile({
  icon: Icon,
  label,
  value,
  sublabel,
}: {
  icon: IconType;
  label: string;
  value: number;
  sublabel?: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-6">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon size={18} />
      </span>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 text-3xl font-semibold text-slate-900">{value.toLocaleString('pt-BR')}</p>
        {sublabel && <p className="mt-0.5 text-xs text-slate-400">{sublabel}</p>}
      </div>
    </div>
  );
}

const ACTION_LABELS: Record<string, string> = {
  CREATE: 'criou',
  UPDATE: 'atualizou',
  DELETE: 'removeu',
  LOGIN: 'entrou no painel',
  LOGIN_FAILED: 'tentou entrar (falhou)',
  LOGOUT: 'saiu do painel',
};

export default async function AdminDashboardPage() {
  const user = await getSessionUser();
  const canManageLeads = user ? hasPermission(user.role, 'leads:manage') : false;
  const canReadAudit = user ? hasPermission(user.role, 'audit:read') : false;

  const settings = await getCachedSiteSettings();

  const [userCount, publishedPosts, totalPosts, publishedModuleContent, newLeads, totalLeads, recentActivity] =
    await Promise.all([
      prisma.user.count(),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.count(),
      settings.mode === 'MANDATE'
        ? prisma.projetoDeLei.count({ where: { publishStatus: 'PUBLISHED' } })
        : prisma.proposta.count({ where: { status: 'PUBLISHED' } }),
      canManageLeads ? prisma.lead.count({ where: { status: 'NEW' } }) : Promise.resolve(0),
      canManageLeads ? prisma.lead.count() : Promise.resolve(0),
      canReadAudit
        ? prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 8 })
        : Promise.resolve([]),
    ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Dashboard" description={`${settings.candidateName} · ${settings.mode === 'MANDATE' ? 'Modo Mandato' : 'Modo Campanha'}`} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={FaNewspaper} label="Notícias publicadas" value={publishedPosts} sublabel={`${totalPosts} no total`} />
        <StatTile
          icon={settings.mode === 'MANDATE' ? FaScaleBalanced : FaLightbulb}
          label={settings.mode === 'MANDATE' ? 'Projetos de lei publicados' : 'Propostas publicadas'}
          value={publishedModuleContent}
        />
        {canManageLeads && (
          <StatTile icon={FaInbox} label="Leads novos" value={newLeads} sublabel={`${totalLeads} no total`} />
        )}
        <StatTile icon={FaUsers} label="Usuários da equipe" value={userCount} />
      </div>

      {canReadAudit && (
        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="font-display text-lg font-semibold text-slate-900">Atividade recente</h2>
          </div>
          {recentActivity.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">Nenhuma atividade registrada ainda.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentActivity.map((log) => (
                <li key={log.id} className="flex items-center justify-between gap-4 px-6 py-3 text-sm">
                  <span className="text-slate-600">
                    <span className="font-medium text-slate-900">{log.userEmailSnapshot ?? 'Sistema'}</span>{' '}
                    {ACTION_LABELS[log.action] ?? log.action.toLowerCase()} {log.entityType}
                  </span>
                  <span className="shrink-0 text-xs text-slate-400">
                    {log.createdAt.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
