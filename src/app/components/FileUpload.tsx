// components/FileUpload.tsx
import { useRef, useState, ChangeEvent } from 'react';
import { useFileUpload } from '../hooks/useFileUpload';
import { motion } from 'framer-motion';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
  path: string;
}

interface FileUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxTotalSize?: number;
  acceptedTypes?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  isOpen,
  onClose,
  onUploadComplete,
  maxFiles = 5,
  maxTotalSize = 100,
  acceptedTypes = "image/*,video/*",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { uploadFiles, uploading, progress, error } = useFileUpload();

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      
      // Validate file count
      if (selectedFiles.length + newFiles.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }
      
      // Validate file types
      const invalidFiles = newFiles.filter(file => {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        return !isImage && !isVideo;
      });
      
      if (invalidFiles.length > 0) {
        alert('Only image and video files are allowed');
        return;
      }
      
      // Validate total size
      const totalSize = [...selectedFiles, ...newFiles].reduce((sum, file) => sum + file.size, 0);
      const totalSizeMB = totalSize / (1024 * 1024);
      
      if (totalSizeMB > maxTotalSize) {
        alert(`Total file size exceeds ${maxTotalSize}MB limit`);
        return;
      }
      
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (selectedFiles.length === 0) {
      alert('Please select files first');
      return;
    }

    try {
      const fileList = new DataTransfer();
      selectedFiles.forEach(file => fileList.items.add(file));
      
      // Use the hook to handle uploads
      const uploadedFiles = await uploadFiles(fileList.files);
      
      // Call parent callback with uploaded files
      if (onUploadComplete) {
        onUploadComplete(uploadedFiles);
      }

      // Reset form
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Close modal after successful upload
      onClose();
    } catch (err: any) {
      console.error('Upload failed:', err);
    }
  };

  const removeFile = (index: number): void => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTotalSize = (): number => {
    return selectedFiles.reduce((sum, file) => sum + file.size, 0);
  };

  const getFileTypeIcon = (type: string): string => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    return '📄';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-xl"
        >
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h2 className="text-xl font-semibold mb-4 text-footer">Upload Media Files</h2>
          
          {/* File Input */}
          <div className="mb-4">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              accept={acceptedTypes}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Max {maxFiles} files, {maxTotalSize}MB total. Images and videos only.
            </p>
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Selected Files:</h3>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <span className="text-lg">{getFileTypeIcon(file.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-800 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-2 text-red-500 hover:text-red-700 text-sm font-bold"
                      title="Remove file"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-2 p-2 bg-blue-50 rounded">
                Total: {formatFileSize(getTotalSize())} | Files: {selectedFiles.length}/{maxFiles}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? `Uploading... ${Math.round(progress)}%` : 'Upload Files'}
          </button>

          {/* Progress Bar */}
          {uploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                {Math.round(progress)}% complete
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FileUpload;