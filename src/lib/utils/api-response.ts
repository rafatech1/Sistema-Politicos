import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { UnauthorizedError, ForbiddenError } from '@/lib/auth/errors';

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Converte erros conhecidos (auth, validação zod) em respostas HTTP
 * apropriadas. Use em todo catch de rota de API para manter status
 * consistentes sem repetir o mapeamento em cada handler.
 */
export function handleApiError(err: unknown) {
  if (err instanceof UnauthorizedError) return jsonError(err.message, 401);
  if (err instanceof ForbiddenError) return jsonError(err.message, 403);
  if (err instanceof ZodError) {
    return NextResponse.json(
      { error: 'Dados inválidos', issues: err.issues },
      { status: 400 },
    );
  }

  console.error(err);
  return jsonError('Erro interno do servidor', 500);
}
