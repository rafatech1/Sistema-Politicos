import { prisma } from '@/lib/prisma';

const WINDOW_MINUTES = 15;
const MAX_ATTEMPTS = 5;

/**
 * Limite de tentativas de login por e-mail, usando o próprio AuditLog como
 * fonte (sem depender de um cache externo como Redis). Suficiente para o
 * volume de tráfego de login administrativo; formulários públicos de alto
 * tráfego (voluntário/contato) devem usar um limitador dedicado quando esse
 * módulo for implementado (ver README > Segurança).
 */
export async function isLoginRateLimited(email: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);

  const failedAttempts = await prisma.auditLog.count({
    where: {
      entityType: 'Auth',
      action: 'LOGIN_FAILED',
      entityId: email.toLowerCase(),
      createdAt: { gte: since },
    },
  });

  return failedAttempts >= MAX_ATTEMPTS;
}
