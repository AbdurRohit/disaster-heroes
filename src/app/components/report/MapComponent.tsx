"use client";

import React, { lazy, Suspense } from 'react';
import { getGeocode } from "use-places-autocomplete";

// Lazy load the GoogleMap component
const GoogleMap = lazy(() => import("@react-google-maps/api").then(module => ({ default: module.GoogleMap })));
const Marker = lazy(() => import("@react-google-maps/api").then(module => ({ default: module.Marker })));

interface MapComponentProps {
  selected: { lat: number; lng: number } | null;
  center: { lat: number; lng: number };
  onMapClick: (lat: number, lng: number) => void;
}

const MapComponent: React.FC<MapComponentProps> = React.memo(({
  selected,
  center,
  onMapClick
}) => {
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      onMapClick(lat, lng);
    }
  };

  return (
    <div className="w-full h-72 relative rounded-lg overflow-hidden border-2 focus-within:border-blue-500 transition-colors duration-200" style={{ borderColor: 'var(--card)' }}>
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      }>
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
          onClick={handleMapClick}
        >
          {selected && (
            <Suspense fallback={null}>
              <Marker position={selected} />
            </Suspense>
          )}
        </GoogleMap>
      </Suspense>
    </div>
  );
});

MapComponent.displayName = 'MapComponent';

export default MapComponent;
