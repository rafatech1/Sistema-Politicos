import { jwtVerify, SignJWT } from 'jose';
import type { Role } from '@prisma/client';

// Lê o segredo diretamente do process.env (em vez de src/lib/env.ts) para que
// este módulo permaneça seguro para uso no Edge Runtime (src/middleware.ts),
// sem arrastar a validação completa de env (DATABASE_URL etc.) para o middleware.
function getAccessSecret(): Uint8Array {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_ACCESS_SECRET ausente ou muito curto (mínimo 32 caracteres).');
  }
  return new TextEncoder().encode(secret);
}

const ACCESS_TOKEN_TTL = '15m';
const ISSUER = 'sistema-politicos';

export interface AccessTokenPayload {
  sub: string;
  role: Role;
  email: string;
}

export async function signAccessToken(payload: AccessTokenPayload): Promise<string> {
  return new SignJWT({ role: payload.role, email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(getAccessSecret());
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getAccessSecret(), { issuer: ISSUER });
    if (!payload.sub || !payload.role || !payload.email) return null;
    return {
      sub: payload.sub,
      role: payload.role as Role,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}
