import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signAccessToken } from '@/lib/auth/jwt';
import { rotateRefreshToken, revokeAllUserTokens } from '@/lib/auth/refresh-token';
import {
  getRefreshTokenCookie,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearAuthCookies,
} from '@/lib/auth/cookies';
import { writeAuditLog } from '@/lib/audit/audit-log';
import { jsonError } from '@/lib/utils/api-response';
import { requestMeta } from '@/lib/utils/request-meta';

export async function POST(request: NextRequest) {
  const presentedToken = getRefreshTokenCookie();
  if (!presentedToken) return jsonError('Sessão expirada.', 401);

  const meta = requestMeta(request);
  const result = await rotateRefreshToken(presentedToken, meta);

  if (result.status === 'reused_revoked') {
    // Reuso de um refresh token já revogado é um sinal de possível roubo:
    // derruba todas as sessões do usuário e força novo login.
    await revokeAllUserTokens(result.userId);
    clearAuthCookies();
    await writeAuditLog({
      entityType: 'Auth',
      entityId: result.userId,
      action: 'LOGOUT',
      userId: result.userId,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
    return jsonError('Sessão inválida. Faça login novamente.', 401);
  }

  if (result.status === 'invalid') {
    clearAuthCookies();
    return jsonError('Sessão expirada.', 401);
  }

  const user = await prisma.user.findUnique({ where: { id: result.userId } });
  if (!user || !user.isActive) {
    clearAuthCookies();
    return jsonError('Usuário inativo.', 401);
  }

  const accessToken = await signAccessToken({ sub: user.id, role: user.role, email: user.email });
  setAccessTokenCookie(accessToken);
  setRefreshTokenCookie(result.token, result.expiresAt);

  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}
