export class UnauthorizedError extends Error {
  constructor(message = 'Não autenticado.') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Sem permissão para executar esta ação.') {
    super(message);
    this.name = 'ForbiddenError';
  }
}
