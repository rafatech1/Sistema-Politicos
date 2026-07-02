import { prisma } from '@/lib/prisma';

// Dashboard placeholder — métricas de visitas (integração de analytics),
// formulários recebidos e conteúdos publicados chegam junto dos módulos que
// as geram (Leads, Propostas, Notícias etc.), em rodadas seguintes.
export default async function AdminDashboardPage() {
  const [userCount, auditLogCount] = await Promise.all([
    prisma.user.count(),
    prisma.auditLog.count(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Usuários da equipe</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{userCount}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Eventos de auditoria registrados</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{auditLogCount}</p>
        </div>
      </div>
      <p className="text-sm text-slate-400">
        Métricas de visitas, formulários e conteúdo publicado serão adicionadas junto dos módulos
        correspondentes.
      </p>
    </div>
  );
}
