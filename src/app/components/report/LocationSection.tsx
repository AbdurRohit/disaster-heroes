"use client";

import React, { ChangeEvent } from 'react';
import { getGeocode } from "use-places-autocomplete";
import PlacesAutocomplete from './PlacesAutocomplete';
import MapComponent from './MapComponent';

interface LocationSectionProps {
  formData: {
    latitude: number | null;
    longitude: number | null;
    locationAddress: string;
    locationLandmark: string;
  };
  selected: { lat: number; lng: number } | null;
  center: { lat: number; lng: number };
  setSelected: (position: { lat: number; lng: number }) => void;
  onAddressSelect: (address: string, name: string) => void;
  onLocationChange: (updates: Partial<LocationSectionProps['formData']>) => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const LocationSection: React.FC<LocationSectionProps> = React.memo(({
  formData,
  selected,
  center,
  setSelected,
  onAddressSelect,
  onLocationChange,
  onInputChange
}) => {
  const handleMapClick = async (lat: number, lng: number) => {
    setSelected({ lat, lng });

    try {
      const results = await getGeocode({ location: { lat, lng } });
      onLocationChange({
        latitude: lat,
        longitude: lng,
        locationAddress: results[0]?.formatted_address || '',
        locationLandmark: results[0]?.formatted_address || ''
      });
    } catch (error) {
      console.error("Error geocoding click location:", error);
      onLocationChange({
        latitude: lat,
        longitude: lng,
        locationAddress: 'Address not available',
      });
    }
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

        try {
          const results = await getGeocode({ location: { lat, lng } });
          onLocationChange({
            latitude: lat,
            longitude: lng,
            locationAddress: results[0].formatted_address || 'Location found',
            locationLandmark: results[0].formatted_address || 'Location found'
          });
        } catch (error) {
          console.error("Error in geocoding:", error);
          onLocationChange({
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

  return (
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
        <MapComponent
          selected={selected}
          center={center}
          onMapClick={handleMapClick}
        />
      </div>

      {/* Search Box and Location Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-grow">
            <PlacesAutocomplete
              setSelected={setSelected}
              onAddressSelect={onAddressSelect}
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
            onChange={onInputChange}
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
    </div>
  );
});

LocationSection.displayName = 'LocationSection';

export default LocationSection;
