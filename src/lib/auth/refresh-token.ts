import { randomBytes, randomUUID, createHash } from 'node:crypto';
import { prisma } from '@/lib/prisma';

const REFRESH_TOKEN_TTL_DAYS = 30;

function generateOpaqueToken(): string {
  return randomBytes(32).toString('base64url');
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export interface IssuedRefreshToken {
  token: string;
  expiresAt: Date;
}

/** Emite um novo refresh token, iniciando uma nova "family" (ex: no login). */
export async function issueRefreshToken(
  userId: string,
  meta: { userAgent?: string | null; ipAddress?: string | null },
): Promise<IssuedRefreshToken> {
  const token = generateOpaqueToken();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      family: randomUUID(),
      expiresAt,
      userAgent: meta.userAgent ?? null,
      ipAddress: meta.ipAddress ?? null,
    },
  });

  return { token, expiresAt };
}

export type RotateResult =
  | { status: 'ok'; userId: string; token: string; expiresAt: Date }
  | { status: 'invalid' }
  | { status: 'reused_revoked'; userId: string };

/**
 * Valida o refresh token apresentado e rotaciona (revoga o atual, emite um novo
 * na mesma family). Se o token apresentado já estiver revogado, é um sinal de
 * reuso/roubo: toda a family é revogada e o chamador deve forçar novo login.
 */
export async function rotateRefreshToken(
  presentedToken: string,
  meta: { userAgent?: string | null; ipAddress?: string | null },
): Promise<RotateResult> {
  const tokenHash = hashToken(presentedToken);
  const existing = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!existing) return { status: 'invalid' };

  if (existing.revokedAt) {
    await prisma.refreshToken.updateMany({
      where: { family: existing.family, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { status: 'reused_revoked', userId: existing.userId };
  }

  if (existing.expiresAt < new Date()) {
    return { status: 'invalid' };
  }

  const newToken = generateOpaqueToken();
  const newTokenHash = hashToken(newToken);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: existing.id },
      data: { revokedAt: new Date(), replacedByTokenHash: newTokenHash },
    }),
    prisma.refreshToken.create({
      data: {
        userId: existing.userId,
        tokenHash: newTokenHash,
        family: existing.family,
        expiresAt,
        userAgent: meta.userAgent ?? null,
        ipAddress: meta.ipAddress ?? null,
      },
    }),
  ]);

  return { status: 'ok', userId: existing.userId, token: newToken, expiresAt };
}

export async function revokeRefreshToken(presentedToken: string): Promise<void> {
  const tokenHash = hashToken(presentedToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function revokeAllUserTokens(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
