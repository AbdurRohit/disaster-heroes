"use client";

import React, { useState, useMemo, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  GoogleMap,
  Marker
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Combobox } from '@headlessui/react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import SuccessMessage from '../components/SuccessToast';
import FileUpload from '../components/FileUpload';
import { useGoogleMaps } from '../hooks/useGoogleMaps';

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

// Location search component using usePlacesAutocomplete
const PlacesAutocomplete = ({ setSelected, onAddressSelect }: {
  setSelected: (position: { lat: number, lng: number }) => void,
  onAddressSelect: (address: string, name: string) => void
}) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();
  
  const [query, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = getLatLng(results[0]);
      setSelected({ lat, lng });
      onAddressSelect(
        results[0].formatted_address || address,
        results[0].address_components?.[0]?.long_name || address
      );
    } catch (error) {
      console.error("Error selecting place:", error);
    }
  };

  return (
    <div className="relative w-full">
      <Combobox value={value} onChange={handleSelect}>
        <div className="relative w-full">
          <Combobox.Input
            className="w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-white"
            placeholder="Search location..."
            displayValue={() => query}
            onChange={(e) => {
              const val = e.target.value;
              setQuery(val);
              setValue(val);
            }}
            disabled={!ready}
          />
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <Combobox.Option
                  key={place_id}
                  value={description}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 px-4 ${
                      active ? 'bg-blue-50 text-gray-900' : 'text-gray-700'
                    }`
                  }
                >
                  {({ selected }) => (
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {description}
                    </span>
                  )}
                </Combobox.Option>
              ))}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );
};

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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
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
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        categories: [...formData.categories, value]
      });
    } else {
      setFormData({
        ...formData,
        categories: formData.categories.filter(category => category !== value)
      });
    }
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
      setFormData({
        ...formData,
        datetime: `${dateStr} at ${time}`
      });
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
    setFormData({
      ...formData,
      locationAddress: address,
      locationLandmark: name || address
    });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setSelected({ lat, lng });

        // Try to reverse geocode
        try {
          const results = await getGeocode({ location: { lat, lng } });

          setFormData({
            ...formData,
            latitude: lat,
            longitude: lng,
            locationAddress: results[0].formatted_address || 'Location found',
            locationLandmark: results[0].formatted_address || 'Location found'
          });
        } catch (error) {
          console.error("Error in geocoding:", error);
          setFormData({
            ...formData,
            latitude: lat,
            longitude: lng,
            locationAddress: 'Location found but address unknown',
          });
        }
      },
      (error) => {
        console.error('Error getting current location:', error);
        alert('Unable to retrieve your location. Please check your browser permissions.');
      }
    );
  };

  // Handle file upload completion
  const handleFileUploadComplete = (uploadedFiles: UploadedFile[]) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      mediaUrls: [...prevFormData.mediaUrls, ...uploadedFiles.map(file => file.url)]
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
        <div className="max-w-8xl mx-auto p-4 pt-14 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin h-10 w-10 mx-auto mb-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p>Loading Google Maps...</p>
          </div>
        </div>
      </>
    );
  }

  // Modify the file upload section in your form
  const fileUploadSection = (
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
      {formData.mediaUrls.length > 0 && (
        <div className="mt-4">
          <p className="text-sm mb-3" id="uploaded-files-count" style={{ color: 'var(--footer)' }}>
            📁 Uploaded files: {formData.mediaUrls.length}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="list" aria-labelledby="uploaded-files-count">
            {formData.mediaUrls.map((url, index) => (
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
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      mediaUrls: prev.mediaUrls.filter((_, i) => i !== index)
                    }));
                  }}
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
        onUploadComplete={handleFileUploadComplete}
      />
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
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
                        onChange={handleInputChange}
                        aria-describedby="title-help"
                      />
                      <p id="title-help" className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Keep it concise and descriptive (e.g., "Flash flood in downtown area")
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
                        onChange={handleInputChange}
                        aria-describedby="description-help"
                      />
                      <p id="description-help" className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Include as much relevant detail as possible to help emergency responders
                      </p>
                    </div>

                    {/* Date & Time Section */}
                    <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--card)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--footer)' }}>📅 Date & Time</p>
                          <p className="text-sm" style={{ color: 'var(--footer)' }}>{formData.datetime}</p>
                        </div>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only"
                            name="modifyDate"
                            checked={modifyDate}
                            onChange={handleModifyDateToggle}
                          />
                          <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${modifyDate ? 'bg-blue-600' : 'bg-gray-300'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${modifyDate ? 'translate-x-6' : 'translate-x-1'}`} />
                          </div>
                          <span className="ml-2 text-sm" style={{ color: 'var(--footer)' }}>Custom date/time</span>
                        </label>
                      </div>

                      {modifyDate && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 rounded-lg border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card)' }}>
                          <div>
                            <label htmlFor="datePicker" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                              Date
                            </label>
                            <input
                              type="date"
                              id="datePicker"
                              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              style={{ 
                                backgroundColor: 'var(--card-bg)', 
                                color: 'var(--text-primary)', 
                                borderColor: 'var(--card)' 
                              }}
                              value={customDate}
                              onChange={handleDateChange}
                            />
                          </div>
                          <div>
                            <label htmlFor="timePicker" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                              Time
                            </label>
                            <input
                              type="time"
                              id="timePicker"
                              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              style={{ 
                                backgroundColor: 'var(--card-bg)', 
                                color: 'var(--text-primary)', 
                                borderColor: 'var(--card)' 
                              }}
                              value={customTime}
                              onChange={handleTimeChange}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Categories */}
                    <div>
                      <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                        🏷️ Incident Categories
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: "earthquake", label: "Earthquake", icon: "🏚️" },
                          { value: "flashFlood", label: "Flash Flood", icon: "🌊" },
                          { value: "forestFire", label: "Forest Fire", icon: "🔥" },
                          { value: "accident", label: "Accident", icon: "🚗" },
                          { value: "others", label: "Others", icon: "⚠️" }
                        ].map(category => (
                          <label key={category.value} className="flex items-center p-3 border rounded-lg cursor-pointer transition-colors duration-200 hover:opacity-80" style={{ borderColor: 'var(--card)', backgroundColor: 'var(--card)' }}>
                            <input
                              type="checkbox"
                              name="categories"
                              value={category.value}
                              className="sr-only"
                              onChange={handleCategoryChange}
                              checked={formData.categories.includes(category.value)}
                            />
                            <div className={`w-5 h-5 border-2 rounded-md mr-3 flex items-center justify-center transition-colors duration-200 ${formData.categories.includes(category.value) ? 'bg-blue-600 border-blue-600' : ''}`} style={{ borderColor: formData.categories.includes(category.value) ? '' : 'var(--footer)' }}>
                              {formData.categories.includes(category.value) && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="mr-2">{category.icon}</span>
                            <span className="text-sm font-medium" style={{ color: 'var(--footer)' }}>{category.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Optional Contact Information */}
                    <div className="border-t pt-6" style={{ borderColor: 'var(--card)' }}>
                      <button
                        type="button"
                        onClick={() => setShowOptionalFields(!showOptionalFields)}
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
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Location & Media */}
                  <div className="space-y-6">
                    <div className="border-b pb-4" style={{ borderColor: 'var(--card)' }}>
                      <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                        📍 Location & Evidence
                      </h2>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Pinpoint the location and add supporting media</p>
                    </div>

                    {/* Map Container */}
                    <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--card)' }}>
                      <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--footer)' }}>
                        🗺️ Incident Location <span className="text-red-500" aria-label="required">*</span>
                      </label>
                      <div className="w-full h-72 relative rounded-lg overflow-hidden border-2 focus-within:border-blue-500 transition-colors duration-200" style={{ borderColor: 'var(--card)' }}>
                        <GoogleMap
                          options={{
                            mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
                            disableDefaultUI: true,
                            zoomControl: true,
                            gestureHandling: 'greedy',
                          }}
                          zoom={10}
                          center={selected || center}
                          mapContainerClassName="w-full h-full"
                          onClick={(e) => {
                            if (e.latLng) {
                              const lat = e.latLng.lat();
                              const lng = e.latLng.lng();
                              setSelected({ lat, lng });

                              // Update form with the new location
                              getGeocode({ location: { lat, lng } })
                                .then((results: google.maps.GeocoderResult[]) => {
                                  setFormData({
                                    ...formData,
                                    latitude: lat,
                                    longitude: lng,
                                    locationAddress: results[0]?.formatted_address || '',
                                    locationLandmark: results[0]?.formatted_address || ''
                                  });
                                })
                                .catch((error: Error) => {
                                  console.error("Error geocoding click location:", error);
                                  setFormData({
                                    ...formData,
                                    latitude: lat,
                                    longitude: lng,
                                    locationAddress: 'Address not available',
                                  });
                                });
                            }
                          }}
                        >
                          {selected && <Marker position={selected} />}
                        </GoogleMap>
                      </div>
                    </div>

                    {/* Search Box and Location Controls */}
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-grow">
                          <PlacesAutocomplete
                            setSelected={setSelected}
                            onAddressSelect={handleAddressSelect}
                          />
                        </div>
                        
                        <button
                          type="button"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center whitespace-nowrap transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          onClick={getCurrentLocation}
                          aria-label="Use current location"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          Current Location
                        </button>
                      </div>

                      {/* Location Details */}
                      <div>
                        <label htmlFor="locationLandmark" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                          Location Landmark
                        </label>
                        <input
                          type="text"
                          id="locationLandmark"
                          name="locationLandmark"
                          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          style={{ 
                            backgroundColor: 'var(--card-bg)', 
                            color: 'var(--text-primary)', 
                            borderColor: 'var(--card)' 
                          }}
                          placeholder="Nearby landmark or specific address"
                          value={formData.locationLandmark}
                          onChange={handleInputChange}
                        />
                      </div>

                      {formData.latitude && formData.longitude && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 dark:bg-green-900/20 dark:border-green-800">
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div className="text-sm">
                              <p className="font-medium text-green-800 dark:text-green-200">Location Selected</p>
                              <p className="text-green-700 dark:text-green-300">Coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}</p>
                              {formData.locationAddress && <p className="text-green-700 dark:text-green-300 mt-1">Address: {formData.locationAddress}</p>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* File Upload Section */}
                    {fileUploadSection}

                    {/* Advanced Options */}
                    <div className="border-t pt-6" style={{ borderColor: 'var(--card)' }}>
                      <button
                        type="button"
                        onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
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
                            onChange={handleInputChange}
                          />
                          <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                            Link to news coverage or official reports about this incident
                          </p>
                        </div>
                      </div>
                    </div>
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