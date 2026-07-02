import { apiFetch } from '@/lib/api-client';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export const uploadService = {
  async uploadImage(file: File): Promise<UploadResult> {
    const form = new FormData();
    form.append('file', file);
    return apiFetch<UploadResult>('/api/upload', {
      method: 'POST',
      auth: true,
      body: form,
    });
  },

  async uploadMultiple(files: File[]): Promise<UploadResult[]> {
    return Promise.all(files.map((file) => this.uploadImage(file)));
  },
};
