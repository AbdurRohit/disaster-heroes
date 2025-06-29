"use client";

import React, { useState, useMemo, useEffect, ChangeEvent, FormEvent, Suspense } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import SuccessMessage from '../components/SuccessToast';
import { useGoogleMaps } from '../hooks/useGoogleMaps';

// Lazy load components for better performance
import BasicInfoForm from '../components/report/BasicInfoForm';
import DateTimeSelector from '../components/report/DateTimeSelector';
import CategorySelector from '../components/report/CategorySelector';
import ContactInfoForm from '../components/report/ContactInfoForm';
import LocationSection from '../components/report/LocationSection';
import MediaUploadSection from '../components/report/MediaUploadSection';
import AdvancedOptions from '../components/report/AdvancedOptions';

// Form data interface
interface FormData {
  title: string;
  description: string;
  datetime: string;
  categories: string[];
  fullName: string;
  email: string;
  phoneNumber: string;
  locationLandmark: string;
  newsSourceLink: string;
  mediaLink: string;
  latitude: number | null;
  longitude: number | null;
  locationAddress: string;
  mediaUrls: string[];
}

// Uploaded file interface from FileUpload component
interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
  path: string;
}

// Loading fallback component
const LoadingFallback = () => (
  <div className="max-w-8xl mx-auto p-4 pt-14 bg-gray-50 min-h-screen flex items-center justify-center">
    <div className="text-center">
      <svg className="animate-spin h-10 w-10 mx-auto mb-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p>Loading form components...</p>
    </div>
  </div>
);

// Main Report Form component
const ReportForm: React.FC = () => {
  // Load Google Maps with places library
  const { isLoaded } = useGoogleMaps();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    datetime: new Date().toLocaleString(),
    categories: [],
    fullName: '',
    email: '',
    phoneNumber: '',
    locationLandmark: '',
    newsSourceLink: '',
    mediaLink: '',
    latitude: null,
    longitude: null,
    locationAddress: '',
    mediaUrls: [],
  });

  // UI state
  const [modifyDate, setModifyDate] = useState<boolean>(false);
  const [customDate, setCustomDate] = useState<string>('');
  const [customTime, setCustomTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  // Collapsible sections state
  const [showOptionalFields, setShowOptionalFields] = useState<boolean>(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);

  const router = useRouter();

  // Default map center (India)
  const center = useMemo(() => ({ lat: 20.5937, lng: 78.9629 }), []);

  // Update form data when map marker is selected
  useEffect(() => {
    if (selected) {
      setFormData(prevFormData => ({
        ...prevFormData,
        latitude: selected.lat,
        longitude: selected.lng,
      }));
    }
  }, [selected]);

  // Form event handlers
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, value]
        : prev.categories.filter(category => category !== value)
    }));
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomDate(e.target.value);
    updateDateTime(e.target.value, customTime);
  };

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomTime(e.target.value);
    updateDateTime(customDate, e.target.value);
  };

  const updateDateTime = (date: string, time: string) => {
    if (date && time) {
      const formattedDate = new Date(date);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      };
      const dateStr = formattedDate.toLocaleDateString('en-US', options);
      setFormData(prev => ({
        ...prev,
        datetime: `${dateStr} at ${time}`
      }));
    }
  };

  const handleModifyDateToggle = (e: ChangeEvent<HTMLInputElement>) => {
    setModifyDate(e.target.checked);

    if (e.target.checked && !customDate) {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      setCustomDate(today);
      setCustomTime(currentTime);
    }
  };

  const handleAddressSelect = (address: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      locationAddress: address,
      locationLandmark: name || address
    }));
  };

  const handleLocationChange = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Handle file upload completion
  const handleFileUploadComplete = (uploadedFiles: UploadedFile[]) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      mediaUrls: [...prevFormData.mediaUrls, ...uploadedFiles.map(file => file.url)]
    }));
  };

  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!formData.latitude || !formData.longitude) {
      alert("Please select a location on the map");
      return;
    }
  
    try {
      setIsSubmitting(true);
      setSubmissionError(null);
  
      // Submit report with media URLs
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) throw new Error("Failed to submit report");
  
      // Show success toast
      setShowSuccessToast(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);
  
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionError("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <>
        <Navbar />
        <LoadingFallback />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-10">
              {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div> */}
              <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                Emergency Report Submission
              </h1>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Report a disaster or emergency situation to help coordinate response efforts and keep communities informed.
              </p>
            </div>

            {/* Main Form */}
            <div className="rounded-2xl shadow-xl border overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card)' }}>
              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Essential Information */}
                  <div className="space-y-6">
                    <Suspense fallback={<LoadingFallback />}>
                      <BasicInfoForm
                        formData={formData}
                        onInputChange={handleInputChange}
                      />
                    </Suspense>

                    <Suspense fallback={<div>Loading date selector...</div>}>
                      <DateTimeSelector
                        formData={formData}
                        modifyDate={modifyDate}
                        customDate={customDate}
                        customTime={customTime}
                        onModifyDateToggle={handleModifyDateToggle}
                        onDateChange={handleDateChange}
                        onTimeChange={handleTimeChange}
                      />
                    </Suspense>

                    <Suspense fallback={<div>Loading categories...</div>}>
                      <CategorySelector
                        categories={formData.categories}
                        onCategoryChange={handleCategoryChange}
                      />
                    </Suspense>

                    <Suspense fallback={<div>Loading contact form...</div>}>
                      <ContactInfoForm
                        formData={formData}
                        showOptionalFields={showOptionalFields}
                        onToggleOptionalFields={() => setShowOptionalFields(!showOptionalFields)}
                        onInputChange={handleInputChange}
                      />
                    </Suspense>
                  </div>

                  {/* Right Column - Location & Media */}
                  <div className="space-y-6">
                    <Suspense fallback={<div>Loading location section...</div>}>
                      <LocationSection
                        formData={formData}
                        selected={selected}
                        center={center}
                        setSelected={setSelected}
                        onAddressSelect={handleAddressSelect}
                        onLocationChange={handleLocationChange}
                        onInputChange={handleInputChange}
                      />
                    </Suspense>

                    <Suspense fallback={<div>Loading media upload...</div>}>
                      <MediaUploadSection
                        mediaUrls={formData.mediaUrls}
                        onFileUploadComplete={handleFileUploadComplete}
                        onRemoveFile={handleRemoveFile}
                      />
                    </Suspense>

                    <Suspense fallback={<div>Loading advanced options...</div>}>
                      <AdvancedOptions
                        formData={formData}
                        showAdvancedOptions={showAdvancedOptions}
                        onToggleAdvancedOptions={() => setShowAdvancedOptions(!showAdvancedOptions)}
                        onInputChange={handleInputChange}
                      />
                    </Suspense>
                  </div>
                </div>

                {/* Submit Section */}
                <div className="border-t mt-8 pt-8" style={{ borderColor: 'var(--card)' }}>
                  <div className="flex flex-col sm:flex-row gap-4 justify-end">
                    <button
                      type="button"
                      className="order-2 sm:order-1 px-6 py-3 border rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 hover:opacity-80"
                      style={{ 
                        borderColor: 'var(--card)', 
                        color: 'var(--text-primary)', 
                        backgroundColor: 'var(--card-bg)' 
                      }}
                      onClick={() => router.push('/')}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="order-1 sm:order-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors duration-200 disabled:bg-red-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting Report...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Submit Emergency Report
                        </>
                      )}
                    </button>
                  </div>

                  {submissionError && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800" role="alert">
                      <div className="flex">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-700 dark:text-red-200 font-medium">{submissionError}</p>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <SuccessMessage isVisible={showSuccessToast} />
    </>
  );
};

export default ReportForm;