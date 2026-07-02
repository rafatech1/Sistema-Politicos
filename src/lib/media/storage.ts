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
