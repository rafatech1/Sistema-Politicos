import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validations/auth.schema';
import { verifyPassword } from '@/lib/auth/password';
import { signAccessToken } from '@/lib/auth/jwt';
import { issueRefreshToken } from '@/lib/auth/refresh-token';
import { setAccessTokenCookie, setRefreshTokenCookie } from '@/lib/auth/cookies';
import { isLoginRateLimited } from '@/lib/auth/login-rate-limit';
import { writeAuditLog } from '@/lib/audit/audit-log';
import { handleApiError, jsonError } from '@/lib/utils/api-response';
import { requestMeta } from '@/lib/utils/request-meta';

export async function POST(request: NextRequest) {
  try {
    const body = loginSchema.parse(await request.json());
    const email = body.email.toLowerCase();
    const { ipAddress, userAgent } = requestMeta(request);

    if (await isLoginRateLimited(email)) {
      return jsonError('Muitas tentativas de login. Tente novamente em alguns minutos.', 429);
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.isActive || !(await verifyPassword(body.password, user.passwordHash))) {
      await writeAuditLog({
        entityType: 'Auth',
        entityId: email,
        action: 'LOGIN_FAILED',
        userEmailSnapshot: email,
        ipAddress,
        userAgent,
      });
      return jsonError('Credenciais inválidas.', 401);
    }

    const accessToken = await signAccessToken({ sub: user.id, role: user.role, email: user.email });
    const { token: refreshToken, expiresAt } = await issueRefreshToken(user.id, {
      ipAddress,
      userAgent,
    });

    setAccessTokenCookie(accessToken);
    setRefreshTokenCookie(refreshToken, expiresAt);

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    await writeAuditLog({
      entityType: 'Auth',
      entityId: user.id,
      action: 'LOGIN',
      userId: user.id,
      userEmailSnapshot: user.email,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
