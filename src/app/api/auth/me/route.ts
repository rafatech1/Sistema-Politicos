import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import { jsonError } from '@/lib/utils/api-response';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return jsonError('Não autenticado.', 401);
  return NextResponse.json(user);
}
