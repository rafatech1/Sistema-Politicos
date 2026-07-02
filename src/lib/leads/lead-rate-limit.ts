import { prisma } from '@/lib/prisma';

const WINDOW_MINUTES = 15;
const MAX_SUBMISSIONS = 5;

/** Limite de envios de formulários públicos (contato/voluntário) por IP. */
export async function isLeadRateLimited(ipAddress: string | null): Promise<boolean> {
  if (!ipAddress) return false;

  const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
  const count = await prisma.lead.count({
    where: { ipAddress, createdAt: { gte: since } },
  });

  return count >= MAX_SUBMISSIONS;
}
