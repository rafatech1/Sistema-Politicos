import type { Role } from '@prisma/client';
import { getAccessTokenCookie } from '@/lib/auth/cookies';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { UnauthorizedError } from '@/lib/auth/errors';
import { prisma } from '@/lib/prisma';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

/**
 * Resolve o usuário autenticado a partir do cookie de access token.
 * Retorna null se não houver sessão válida (sem lançar erro) — use quando a
 * ausência de sessão é um estado esperado (ex: página de login).
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = getAccessTokenCookie();
  if (!token) return null;

  const payload = await verifyAccessToken(token);
  if (!payload) return null;

  // Confere o estado atual no banco (não apenas o JWT) para que desativação
  // de usuário ou mudança de papel tenham efeito imediato, sem esperar o
  // access token expirar. Esta é a validação "real" — o middleware Edge
  // (src/middleware.ts) só verifica o JWT e serve como gate de UX.
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.isActive) return null;

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

/** Igual a getSessionUser(), mas lança UnauthorizedError se não houver sessão. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new UnauthorizedError();
  return user;
}
