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

/**
 * Caminho/URL de imagem: aceita tanto uma URL absoluta (link externo colado,
 * ou retorno do S3StorageAdapter) quanto um caminho relativo iniciando com "/"
 * (retorno do LocalStorageAdapter, ex: "/uploads/content/…"). `z.string().url()`
 * sozinho rejeitaria o caminho relativo do upload local.
 */
export const imagePath = z
  .string()
  .refine((val) => val.startsWith('/') || /^https?:\/\//.test(val), 'Informe uma URL de imagem válida');

/** Versão opcional de imagePath vinda de um <input> não obrigatório: string vazia vira undefined. */
export const optionalImagePath = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : val),
  imagePath.optional(),
);
