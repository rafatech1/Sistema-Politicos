import { z } from 'zod';

/** Number opcional vindo de um <input type="number">: string vazia vira undefined em vez de 0. */
export const optionalNumber = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : val),
  z.coerce.number().optional(),
);

/** Date opcional vinda de um <input type="date">: string vazia vira undefined em vez de "Invalid Date". */
export const optionalDate = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : val),
  z.coerce.date().optional(),
);

/** Slug opcional vindo de um <input> não obrigatório: string vazia vira undefined em vez de falhar min(1). */
export const optionalSlug = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : val),
  z.string().min(1).optional(),
);

/**
 * Enum vindo de um <select> não obrigatório: string vazia (opção "—") vira undefined
 * para que `.default()` seja aplicado, em vez de falhar como valor de enum inválido.
 */
export function optionalEnum<T extends [string, ...string[]]>(values: T, defaultValue: T[number]) {
  return z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : val),
    z.enum(values).default(defaultValue),
  );
}
