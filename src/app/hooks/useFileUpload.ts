// hooks/useFileUpload.ts
import { useState } from 'react';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
  path: string;
}

interface UseFileUploadReturn {
  uploadFiles: (files: FileList) => Promise<UploadedFile[]>;
  uploading: boolean;
  progress: number;
  error: string | null;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = (files: FileList): boolean => {
    const maxFiles = 5;
    const maxTotalSize = 100 * 1024 * 1024; // 100MB in bytes

    if (files.length > maxFiles) {
      throw new Error(`Maximum ${maxFiles} files allowed`);
    }

    const totalSize = Array.from(files).reduce((sum, file) => sum + file.size, 0);
    if (totalSize > maxTotalSize) {
      throw new Error('Total file size exceeds 100MB limit');
    }

    return true;
  };

  const uploadFiles = async (files: FileList): Promise<UploadedFile[]> => {
    try {
      setUploading(true);
      setError(null);
      setProgress(0);

      // Validate files
      validateFiles(files);

      const uploadedFiles: UploadedFile[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/files', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await response.json();
        
        uploadedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          url: data.url,
          path: data.url
        });

        // Update progress
        setProgress(((i + 1) / files.length) * 100);
      }

      return uploadedFiles;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFiles,
    uploading,
    progress,
    error
  };
};