import { randomUUID } from 'node:crypto';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { sanitizeFilename, type StorageAdapter, type UploadInput, type UploadResult } from '@/lib/media/storage';
import { env } from '@/lib/env';

// Armazenamento S3-compatível (Cloudflare R2, Backblaze B2 etc.), selecionado
// via MEDIA_STORAGE_PROVIDER=s3 (ver media/index.ts). As variáveis S3_* são
// obrigatórias nesse caso — validado em src/lib/env.ts.
function getClient(): S3Client {
  return new S3Client({
    region: env.S3_REGION,
    endpoint: env.S3_ENDPOINT,
    forcePathStyle: true, // necessário para R2/B2, inofensivo no S3 real
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID!,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY!,
    },
  });
}

export class S3StorageAdapter implements StorageAdapter {
  async upload(file: UploadInput, opts?: { folder?: string }): Promise<UploadResult> {
    const folder = opts?.folder ?? 'general';
    const key = `${folder}/${randomUUID()}-${sanitizeFilename(file.filename)}`;

    await getClient().send(
      new PutObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimeType,
      }),
    );

    return { url: this.getPublicUrl(key), key };
  }

  async delete(key: string): Promise<void> {
    await getClient().send(new DeleteObjectCommand({ Bucket: env.S3_BUCKET, Key: key }));
  }

  getPublicUrl(key: string): string {
    return `${env.S3_PUBLIC_BASE_URL}/${key}`;
  }
}
