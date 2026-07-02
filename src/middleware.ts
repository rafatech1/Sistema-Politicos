import { NextResponse, type NextRequest } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { ACCESS_TOKEN_COOKIE } from '@/lib/auth/cookies';

// Gate de UX no Edge Runtime: redireciona para /admin/login se o JWT estiver
// ausente/inválido. Não consegue checar estado do banco (usuário desativado,
// papel alterado) — essa validação "real" acontece em requireUser() no
// servidor (src/lib/auth/session.ts), chamada por toda rota/página admin.
export async function middleware(request: NextRequest) {
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const payload = token ? await verifyAccessToken(token) : null;

  if (!payload) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/((?!login).*)'],
};
