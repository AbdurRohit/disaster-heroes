"use client";

import React, { useState, useMemo, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Combobox } from '@headlessui/react';
import Navbar from '../components/Navbar';

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
}

// API service for form submission
const reportService = {
  submitReport: async (formData: FormData) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting report:', error);
      throw error;
    }
  }
};

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
      const { lat, lng } = await getLatLng(results[0]);
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
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ["places"],
  });

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
    locationAddress: ''
  });

  // UI state
  const [modifyDate, setModifyDate] = useState<boolean>(false);
  const [customDate, setCustomDate] = useState<string>('');
  const [customTime, setCustomTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.latitude || !formData.longitude) {
      alert('Please select a location on the map');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmissionError(null);

      const response = await reportService.submitReport(formData);
      console.log('Form submitted successfully:', response);

      alert('Report submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionError('Failed to submit report. Please try again.');
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

  return (
    <>
      <Navbar />
      <div className="max-w-8xl mx-auto p-4 pt-14 bg-gray-50">
        <div className="mt-8">
          <h1 className="text-3xl font-bold text-red-600 mb-6">Submit a new report</h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Report title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-white"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  className="w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-white"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-700">Date & time at: {formData.datetime}</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4"
                      name="modifyDate"
                      checked={modifyDate}
                      onChange={handleModifyDateToggle}
                    />
                    <span className="ml-2 text-sm text-gray-600">Modify date</span>
                  </label>
                </div>

                {modifyDate && (
                  <div className="p-4 bg-white rounded-md border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="datePicker" className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          id="datePicker"
                          className="w-full border border-gray-300 rounded-md p-2 text-gray-900"
                          value={customDate}
                          onChange={handleDateChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="timePicker" className="block text-sm font-medium text-gray-700 mb-1">
                          Time
                        </label>
                        <input
                          type="time"
                          id="timePicker"
                          className="w-full border border-gray-300 rounded-md p-2 text-gray-900"
                          value={customTime}
                          onChange={handleTimeChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Categories</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "earthquake", label: "Earthquake" },
                    { value: "flashFlood", label: "Flash Flood" },
                    { value: "forestFire", label: "Forest Fire" },
                    { value: "accident", label: "Accident" },
                    { value: "others", label: "Others" }
                  ].map(category => (
                    <label key={category.value} className="flex items-center">
                      <input
                        type="checkbox"
                        name="categories"
                        value={category.value}
                        className="form-checkbox h-4 w-4"
                        onChange={handleCategoryChange}
                        checked={formData.categories.includes(category.value)}
                      />
                      <span className="ml-2 text-sm text-gray-600">{category.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-4">Optional Information:</p>

                <div className="mb-4">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-white"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email id
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-white"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    className="w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-white"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Map Container */}
              <div className="w-full h-72 relative rounded-lg overflow-hidden border border-gray-300">
                <GoogleMap
                  options={{
                    mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
                    disableDefaultUI: true,
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

              {/* Search Box and Location Controls */}
              <div className="flex items-center space-x-2">
                <div className="flex-grow">
                  <PlacesAutocomplete
                    setSelected={setSelected}
                    onAddressSelect={handleAddressSelect}
                  />
                </div>
                
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center whitespace-nowrap"
                  onClick={getCurrentLocation}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Current Location
                </button>
              </div>

              {/* Location Details */}
              <div>
                <label htmlFor="locationLandmark" className="block text-sm font-medium text-gray-700 mb-1">
                  Location landmark
                </label>
                <input
                  type="text"
                  id="locationLandmark"
                  name="locationLandmark"
                  className="w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-white"
                  value={formData.locationLandmark}
                  onChange={handleInputChange}
                />
              </div>

              {formData.latitude && formData.longitude && (
                <div className="bg-gray-100 p-2 rounded text-sm text-gray-700">
                  <p>Selected coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}</p>
                  {formData.locationAddress && <p>Address: {formData.locationAddress}</p>}
                </div>
              )}

              {/* Additional Information */}
              <div>
                <label htmlFor="newsSourceLink" className="block text-sm font-medium text-gray-700 mb-1">
                  News source link
                </label>
                <input
                  type="url"
                  id="newsSourceLink"
                  name="newsSourceLink"
                  className="w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-white"
                  value={formData.newsSourceLink}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="mediaLink" className="block text-sm font-medium text-gray-700 mb-1">
                  Image / Video
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="mediaLink"
                    name="mediaLink"
                    placeholder="Link to the media"
                    className="flex-grow border border-gray-300 rounded-l-md p-2 text-gray-900 bg-white"
                    value={formData.mediaLink}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="bg-white border border-gray-300 border-l-0 rounded-r-md px-4 py-2 flex items-center text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    Upload Media
                  </button>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4 pt-10">
                  <button
                    type="button"
                    className="border border-gray-300 rounded-md px-6 py-2 bg-white text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-red-500 hover:bg-red-600 text-white rounded-md px-6 py-2 disabled:bg-red-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>

                {submissionError && (
                  <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
                    {submissionError}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ReportForm;