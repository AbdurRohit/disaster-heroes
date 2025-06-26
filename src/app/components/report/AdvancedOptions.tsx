"use client";

import React, { ChangeEvent } from 'react';

interface AdvancedOptionsProps {
  formData: {
    newsSourceLink: string;
  };
  showAdvancedOptions: boolean;
  onToggleAdvancedOptions: () => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const AdvancedOptions: React.FC<AdvancedOptionsProps> = React.memo(({
  formData,
  showAdvancedOptions,
  onToggleAdvancedOptions,
  onInputChange
}) => {
  return (
    <div className="border-t pt-6" style={{ borderColor: 'var(--card)' }}>
      <button
        type="button"
        onClick={onToggleAdvancedOptions}
        className="flex items-center justify-between w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 -m-2"
        aria-expanded={showAdvancedOptions}
        aria-controls="advanced-options"
      >
        <div>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            ⚙️ Advanced Options
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Additional information and references</p>
        </div>
        <svg 
          className={`w-5 h-5 transition-transform duration-200 ${showAdvancedOptions ? 'rotate-180' : ''}`} 
          style={{ color: 'var(--text-secondary)' }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div 
        id="advanced-options"
        className={`mt-4 transition-all duration-300 ease-in-out ${showAdvancedOptions ? 'opacity-100 max-h-32' : 'opacity-0 max-h-0 overflow-hidden'}`}
      >
        <div>
          <label htmlFor="newsSourceLink" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            📰 News Source Link
          </label>
          <input
            type="url"
            id="newsSourceLink"
            name="newsSourceLink"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            style={{ 
              backgroundColor: 'var(--card-bg)', 
              color: 'var(--text-primary)', 
              borderColor: 'var(--card)' 
            }}
            placeholder="https://example.com/news-article"
            value={formData.newsSourceLink}
            onChange={onInputChange}
          />
          <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
            Link to news coverage or official reports about this incident
          </p>
        </div>
      </div>
    </div>
  );
});

AdvancedOptions.displayName = 'AdvancedOptions';

export default AdvancedOptions;
