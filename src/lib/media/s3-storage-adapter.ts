import type { StorageAdapter, UploadInput, UploadResult } from '@/lib/media/storage';

// Stub para armazenamento S3-compatível (Cloudflare R2, Backblaze B2 etc.).
// TODO: implementar com @aws-sdk/client-s3 quando o upload de mídia for
// construído (usa S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID,
// S3_SECRET_ACCESS_KEY, S3_PUBLIC_BASE_URL do .env). Selecionado
// automaticamente quando MEDIA_STORAGE_PROVIDER=s3 (ver media/index.ts).
export class S3StorageAdapter implements StorageAdapter {
  async upload(_file: UploadInput, _opts?: { folder?: string }): Promise<UploadResult> {
    throw new Error('S3StorageAdapter ainda não implementado. Use MEDIA_STORAGE_PROVIDER=local.');
  }

  async delete(_key: string): Promise<void> {
    throw new Error('S3StorageAdapter ainda não implementado. Use MEDIA_STORAGE_PROVIDER=local.');
  }

  getPublicUrl(key: string): string {
    const base = process.env.S3_PUBLIC_BASE_URL ?? '';
    return `${base}/${key}`;
  }
}
