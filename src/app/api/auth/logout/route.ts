import { NextResponse, type NextRequest } from 'next/server';
import { getRefreshTokenCookie, clearAuthCookies } from '@/lib/auth/cookies';
import { revokeRefreshToken } from '@/lib/auth/refresh-token';
import { getSessionUser } from '@/lib/auth/session';
import { writeAuditLog } from '@/lib/audit/audit-log';
import { requestMeta } from '@/lib/utils/request-meta';

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  const presentedToken = getRefreshTokenCookie();

  if (presentedToken) await revokeRefreshToken(presentedToken);
  clearAuthCookies();

  if (user) {
    const meta = requestMeta(request);
    await writeAuditLog({
      entityType: 'Auth',
      entityId: user.id,
      action: 'LOGOUT',
      userId: user.id,
      userEmailSnapshot: user.email,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
  }

  return NextResponse.json({ success: true });
}
