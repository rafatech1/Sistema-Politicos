import type { Role } from '@prisma/client';
import { ForbiddenError } from '@/lib/auth/errors';
import type { SessionUser } from '@/lib/auth/session';

export type Permission =
  | 'settings:read'
  | 'settings:write'
  | 'users:manage'
  | 'audit:read'
  | 'content:read'
  | 'content:write'
  | 'content:publish';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    'settings:read',
    'settings:write',
    'users:manage',
    'audit:read',
    'content:read',
    'content:write',
    'content:publish',
  ],
  EDITOR: ['content:read', 'content:write'],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function requirePermission(user: SessionUser, permission: Permission): void {
  if (!hasPermission(user.role, permission)) {
    throw new ForbiddenError(`Papel "${user.role}" não tem a permissão "${permission}".`);
  }
}
