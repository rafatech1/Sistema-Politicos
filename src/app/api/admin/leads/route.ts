import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth/session';
import { requirePermission } from '@/lib/auth/rbac';
import { handleApiError } from '@/lib/utils/api-response';
import type { LeadStatus, LeadType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    requirePermission(user, 'leads:manage');

    const type = request.nextUrl.searchParams.get('type');
    const status = request.nextUrl.searchParams.get('status');

    const leads = await prisma.lead.findMany({
      where: {
        type: type && type !== 'ALL' ? (type as LeadType) : undefined,
        status: status && status !== 'ALL' ? (status as LeadStatus) : undefined,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(leads);
  } catch (err) {
    return handleApiError(err);
  }
}
