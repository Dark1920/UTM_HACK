export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export const uploadService = {
  async uploadImage(file: File): Promise<UploadResult> {
    await new Promise(r => setTimeout(r, 800));
    return {
      url: `https://placehold.co/600x400/333/FFF?text=${encodeURIComponent(file.name)}`,
      filename: file.name,
      size: file.size,
      type: file.type,
    };
  },

  async uploadMultiple(files: File[]): Promise<UploadResult[]> {
    await new Promise(r => setTimeout(r, 1200));
    return files.map(file => ({
      url: `https://placehold.co/600x400/333/FFF?text=${encodeURIComponent(file.name)}`,
      filename: file.name,
      size: file.size,
      type: file.type,
    }));
  },

  async deleteFile(url: string): Promise<void> {
    await new Promise(r => setTimeout(r, 300));
  },
};
