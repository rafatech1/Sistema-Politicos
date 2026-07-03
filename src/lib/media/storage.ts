export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
}

export interface UploadInput {
  buffer: Buffer;
  filename: string;
  mimeType: string;
}

export interface UploadResult {
  url: string;
  key: string;
}

export interface StorageAdapter {
  upload(file: UploadInput, opts?: { folder?: string }): Promise<UploadResult>;
  delete(key: string): Promise<void>;
  getPublicUrl(key: string): string;
}
