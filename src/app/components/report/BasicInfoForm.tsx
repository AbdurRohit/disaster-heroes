"use client";

import React, { ChangeEvent } from 'react';

interface BasicInfoFormProps {
  formData: {
    title: string;
    description: string;
  };
  onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = React.memo(({ 
  formData, 
  onInputChange 
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4" style={{ borderColor: 'var(--card)' }}>
        <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          📝 Essential Information
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Required details about the incident</p>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Report Title <span className="text-red-500" aria-label="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          style={{ 
            backgroundColor: 'var(--card-bg)', 
            color: 'var(--text-primary)', 
            borderColor: 'var(--card)' 
          }}
          placeholder="Brief description of the incident"
          value={formData.title}
          onChange={onInputChange}
          aria-describedby="title-help"
        />
        <p id="title-help" className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
          Keep it concise and descriptive (e.g., &quot;Flash flood in downtown area&quot;)
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Detailed Description <span className="text-red-500" aria-label="required">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-vertical"
          style={{ 
            backgroundColor: 'var(--card-bg)', 
            color: 'var(--text-primary)', 
            borderColor: 'var(--card)' 
          }}
          placeholder="Provide detailed information about what happened, current situation, and any immediate dangers..."
          value={formData.description}
          onChange={onInputChange}
          aria-describedby="description-help"
        />
        <p id="description-help" className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
          Include as much relevant detail as possible to help emergency responders
        </p>
      </div>
    </div>
  );
});

BasicInfoForm.displayName = 'BasicInfoForm';

export default BasicInfoForm;
