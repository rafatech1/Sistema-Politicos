import { randomUUID } from 'node:crypto';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import type { StorageAdapter, UploadInput, UploadResult } from '@/lib/media/storage';

// Grava em public/uploads/. ATENÇÃO: adequado apenas para desenvolvimento
// local — o filesystem da Vercel é efêmero/somente-leitura em produção.
// Para deploys reais, configure MEDIA_STORAGE_PROVIDER=s3 (ver s3-storage-adapter.ts).
const UPLOADS_ROOT = path.join(process.cwd(), 'public', 'uploads');
const PUBLIC_PREFIX = '/uploads';

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
}

export class LocalStorageAdapter implements StorageAdapter {
  async upload(file: UploadInput, opts?: { folder?: string }): Promise<UploadResult> {
    const folder = opts?.folder ?? 'general';
    const dir = path.join(UPLOADS_ROOT, folder);
    await mkdir(dir, { recursive: true });

    const key = `${folder}/${randomUUID()}-${sanitizeFilename(file.filename)}`;
    await writeFile(path.join(UPLOADS_ROOT, key), file.buffer);

    return { url: this.getPublicUrl(key), key };
  }

  async delete(key: string): Promise<void> {
    try {
      await unlink(path.join(UPLOADS_ROOT, key));
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
    }
  }

  getPublicUrl(key: string): string {
    return `${PUBLIC_PREFIX}/${key}`;
  }
}
