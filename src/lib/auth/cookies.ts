import { cookies } from 'next/headers';

export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REFRESH_TOKEN_COOKIE = 'refresh_token';

const isProduction = process.env.NODE_ENV === 'production';

export function setAccessTokenCookie(token: string): void {
  cookies().set(ACCESS_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60,
  });
}

export function setRefreshTokenCookie(token: string, expiresAt: Date): void {
  cookies().set(REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/api/auth/refresh',
    expires: expiresAt,
  });
}

export function clearAuthCookies(): void {
  cookies().set(ACCESS_TOKEN_COOKIE, '', { path: '/', maxAge: 0 });
  cookies().set(REFRESH_TOKEN_COOKIE, '', { path: '/api/auth/refresh', maxAge: 0 });
}

export function getAccessTokenCookie(): string | undefined {
  return cookies().get(ACCESS_TOKEN_COOKIE)?.value;
}

export function getRefreshTokenCookie(): string | undefined {
  return cookies().get(REFRESH_TOKEN_COOKIE)?.value;
}
