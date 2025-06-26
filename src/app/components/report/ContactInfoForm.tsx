"use client";

import React, { ChangeEvent } from 'react';

interface ContactInfoFormProps {
  formData: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  showOptionalFields: boolean;
  onToggleOptionalFields: () => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const ContactInfoForm: React.FC<ContactInfoFormProps> = React.memo(({
  formData,
  showOptionalFields,
  onToggleOptionalFields,
  onInputChange
}) => {
  return (
    <div className="border-t pt-6" style={{ borderColor: 'var(--card)' }}>
      <button
        type="button"
        onClick={onToggleOptionalFields}
        className="flex items-center justify-between w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 -m-2"
        aria-expanded={showOptionalFields}
        aria-controls="optional-fields"
      >
        <div>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            👤 Contact Information
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Optional - Help responders contact you</p>
        </div>
        <svg 
          className={`w-5 h-5 transition-transform duration-200 ${showOptionalFields ? 'rotate-180' : ''}`} 
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
        id="optional-fields"
        className={`mt-4 space-y-4 transition-all duration-300 ease-in-out ${showOptionalFields ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}
      >
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            style={{ 
              backgroundColor: 'var(--card-bg)', 
              color: 'var(--text-primary)', 
              borderColor: 'var(--card)' 
            }}
            placeholder="Your full name"
            value={formData.fullName}
            onChange={onInputChange}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            style={{ 
              backgroundColor: 'var(--card-bg)', 
              color: 'var(--text-primary)', 
              borderColor: 'var(--card)' 
            }}
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={onInputChange}
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            style={{ 
              backgroundColor: 'var(--card-bg)', 
              color: 'var(--text-primary)', 
              borderColor: 'var(--card)' 
            }}
            placeholder="+1 (555) 123-4567"
            value={formData.phoneNumber}
            onChange={onInputChange}
          />
        </div>
      </div>
    </div>
  );
});

ContactInfoForm.displayName = 'ContactInfoForm';

export default ContactInfoForm;
