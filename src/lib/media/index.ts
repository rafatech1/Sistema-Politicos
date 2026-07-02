import { env } from '@/lib/env';
import type { StorageAdapter } from '@/lib/media/storage';
import { LocalStorageAdapter } from '@/lib/media/local-storage-adapter';
import { S3StorageAdapter } from '@/lib/media/s3-storage-adapter';

export function getStorageAdapter(): StorageAdapter {
  return env.MEDIA_STORAGE_PROVIDER === 's3' ? new S3StorageAdapter() : new LocalStorageAdapter();
}

export type { StorageAdapter, UploadInput, UploadResult } from '@/lib/media/storage';
