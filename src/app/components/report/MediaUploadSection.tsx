"use client";

import React, { useState } from 'react';
import FileUpload from '../FileUpload';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
  path: string;
}

interface MediaUploadSectionProps {
  mediaUrls: string[];
  onFileUploadComplete: (uploadedFiles: UploadedFile[]) => void;
  onRemoveFile: (index: number) => void;
}

const MediaUploadSection: React.FC<MediaUploadSectionProps> = React.memo(({
  mediaUrls,
  onFileUploadComplete,
  onRemoveFile
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--card)' }}>
      <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--footer)' }}>
        📎 Media Files
      </label>
      
      <button
        type="button"
        onClick={() => setIsUploadModalOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-lg shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Add media files to report"
      >
        <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Media Files
      </button>

      {/* Display uploaded files */}
      {mediaUrls.length > 0 && (
        <div className="mt-4">
          <p className="text-sm mb-3" id="uploaded-files-count" style={{ color: 'var(--footer)' }}>
            📁 Uploaded files: {mediaUrls.length}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="list" aria-labelledby="uploaded-files-count">
            {mediaUrls.map((url, index) => (
              <div key={index} className="relative group" role="listitem">
                <img
                  src={url}
                  alt={`Uploaded file ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg border shadow-sm"
                  style={{ borderColor: 'var(--card)' }}
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50" y="50" font-family="Arial" font-size="12" fill="%23999" text-anchor="middle" dy="0.3em"%3EFile%3C/text%3E%3C/svg%3E';
                  }}
                />
                <button
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label={`Remove uploaded file ${index + 1}`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Upload Modal */}
      <FileUpload
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={onFileUploadComplete}
      />
    </div>
  );
});

MediaUploadSection.displayName = 'MediaUploadSection';

export default MediaUploadSection;
