import type { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth/password';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
  isActive?: boolean;
}

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export function listUsers() {
  return prisma.user.findMany({
    select: publicUserSelect,
    orderBy: { createdAt: 'asc' },
  });
}

export function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id }, select: publicUserSelect });
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
}

export async function createUser(data: CreateUserData) {
  const passwordHash = await hashPassword(data.password);
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role,
    },
    select: publicUserSelect,
  });
}

export async function updateUser(id: string, data: UpdateUserData) {
  return prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email?.toLowerCase(),
      role: data.role,
      isActive: data.isActive,
      passwordHash: data.password ? await hashPassword(data.password) : undefined,
    },
    select: publicUserSelect,
  });
}

export function deleteUser(id: string) {
  return prisma.user.delete({ where: { id }, select: publicUserSelect });
}

export function countActiveAdmins(excludeId?: string) {
  return prisma.user.count({
    where: { role: 'ADMIN', isActive: true, id: excludeId ? { not: excludeId } : undefined },
  });
}
