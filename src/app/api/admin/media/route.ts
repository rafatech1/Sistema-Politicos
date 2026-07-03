import { NextResponse, type NextRequest } from 'next/server';
import { requireUser } from '@/lib/auth/session';
import { requirePermission } from '@/lib/auth/rbac';
import { getStorageAdapter } from '@/lib/media';
import { handleApiError, jsonError } from '@/lib/utils/api-response';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    requirePermission(user, 'content:write');

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return jsonError('Nenhum arquivo enviado.', 400);
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return jsonError('Tipo de arquivo não permitido. Use PNG, JPEG, WebP ou GIF.', 400);
    }

    if (file.size > MAX_SIZE_BYTES) {
      return jsonError('Arquivo muito grande. Tamanho máximo: 5MB.', 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await getStorageAdapter().upload(
      { buffer, filename: file.name, mimeType: file.type },
      { folder: 'content' },
    );

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
