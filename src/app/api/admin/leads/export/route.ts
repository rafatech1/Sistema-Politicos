import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth/session';
import { requirePermission } from '@/lib/auth/rbac';
import { handleApiError } from '@/lib/utils/api-response';

function escapeCsvCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET() {
  try {
    const user = await requireUser();
    requirePermission(user, 'leads:manage');

    const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });

    const header = ['Data', 'Tipo', 'Nome', 'E-mail', 'Telefone', 'Cidade', 'Mensagem', 'Status'];
    const rows = leads.map((lead) => [
      lead.createdAt.toISOString(),
      lead.type,
      lead.name,
      lead.email ?? '',
      lead.phone ?? '',
      lead.city ?? '',
      lead.message ?? '',
      lead.status,
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => escapeCsvCell(String(cell))).join(','))
      .join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="leads.csv"',
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
