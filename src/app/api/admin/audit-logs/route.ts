import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth/session';
import { requirePermission } from '@/lib/auth/rbac';
import { handleApiError } from '@/lib/utils/api-response';
import type { AuditAction } from '@prisma/client';

const MAX_RESULTS = 200;

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    requirePermission(user, 'audit:read');

    const action = request.nextUrl.searchParams.get('action');
    const entityType = request.nextUrl.searchParams.get('entityType');

    const logs = await prisma.auditLog.findMany({
      where: {
        action: action && action !== 'ALL' ? (action as AuditAction) : undefined,
        entityType: entityType && entityType !== 'ALL' ? entityType : undefined,
      },
      orderBy: { createdAt: 'desc' },
      take: MAX_RESULTS,
    });

    return NextResponse.json(logs);
  } catch (err) {
    return handleApiError(err);
  }
}
