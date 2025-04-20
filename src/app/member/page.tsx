"use client";

import React, { useState, useEffect } from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker
} from "@react-google-maps/api";
// Use Navbar component or remove the import
import Navbar from '../components/Navbar';
// Remove unused Router import
import router from 'next/router';

// Types for disaster data
interface Disaster {
  id: string;
  type: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  severity: string;
  date: string;
}

// Types for notification data
interface Notification {
  id: string;
  type: 'alert' | 'update' | 'report';
  title: string;
  description: string;
  timestamp: string;
  relatedDisasterId?: string;
}

// API services
const disasterService = {
  getActiveDisasters: async (): Promise<Disaster[]> => {
    try {
      const response = await fetch('/api/disasters/active');
      if (!response.ok) {
        throw new Error('Failed to fetch active disasters');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching active disasters:', error);
      return [];
    }
  }
};

const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }
};

// Format time difference from now
const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const pastDate = new Date(dateString);
  const diffMs = now.getTime() - pastDate.getTime();
  
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 60) {
    return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  }
  
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
};

// Map marker icon based on disaster type

// Main page component
export default function DisasterManagementPage() {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 37.0902, lng: -95.7129 }); // US center

  // Load Google Maps
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [disastersData, notificationsData] = await Promise.all([
          disasterService.getActiveDisasters(),
          notificationService.getNotifications()
        ]);
        
        setDisasters(disastersData);
        setNotifications(notificationsData);
        
        // Set map center to first disaster if available
        if (disastersData.length > 0) {
          setMapCenter(disastersData[0].coordinates);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show loading state
  if (loading && !isLoaded) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 mx-auto mb-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Loading disaster management dashboard...</p>
        </div>
      </div>
    );
  }

  // Mock data for development (will be replaced by API data)
  const mockDisasters: Disaster[] = disasters.length > 0 ? disasters : [
    {
      id: '1',
      type: 'Hurricane',
      location: 'Miami, FL',
      coordinates: { lat: 25.7617, lng: -80.1918 },
      severity: 'High',
      date: '2025-04-15T08:00:00Z'
    },
    {
      id: '2',
      type: 'Wildfire',
      location: 'Austin, TX',
      coordinates: { lat: 30.2672, lng: -97.7431 },
      severity: 'Medium',
      date: '2025-04-14T12:00:00Z'
    },
    {
      id: '3',
      type: 'Flood',
      location: 'Nashville, TN',
      coordinates: { lat: 36.1627, lng: -86.7816 },
      severity: 'Medium',
      date: '2025-04-14T15:00:00Z'
    },
    {
      id: '4',
      type: 'Earthquake',
      location: 'San Jose, CA',
      coordinates: { lat: 37.3382, lng: -121.8863 },
      severity: 'Low',
      date: '2025-04-13T22:00:00Z'
    }
  ];

  const mockNotifications: Notification[] = notifications.length > 0 ? notifications : [
    {
      id: '101',
      type: 'report',
      title: 'New wildfire reported nearby',
      description: '25 min, ago',
      timestamp: '2025-04-15T12:35:00Z'
    },
    {
      id: '102',
      type: 'alert',
      title: 'Flood alert in Nashile, TN',
      description: '1 hour ago',
      timestamp: '2025-04-15T12:00:00Z'
    },
    {
      id: '103',
      type: 'update',
      title: 'Disaster Update Hurricane in Miami, FL',
      description: '8 hours ago',
      timestamp: '2025-04-15T04:00:00Z'
    }
  ];

  // Get marker color based on disaster type
  const getMarkerColor = (disasterType: string): string => {
    switch (disasterType.toLowerCase()) {
      case 'hurricane':
        return 'blue';
      case 'wildfire':
        return 'red';
      case 'flood':
        return 'blue';
      case 'earthquake':
        return 'gray';
      default:
        return 'yellow';
    }
  };

  // Function to determine icon for notification type

  return (
    <>
    <div className='pb-20'>
      <Navbar/>
    </div>
    <div className="min-h-screen bg-navbg">

      {/* Main content */}

          {/* Map Panel - Spans 2 columns */}
          <div className="bg-card m-5 rounded-lg shadow-md p-3 md:col-span-2">
            {/* <h2 className="text-2xl text-gray-800 font-bold mb-4">Map</h2> */}
            {isLoaded ? (
              <div className="w-full h-96 rounded-md overflow-hidden">
                <GoogleMap
                  mapContainerClassName="w-full h-full"
                  center={mapCenter}
                  zoom={5}
                  options={{
                    mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
                    disableDefaultUI: true,
                    zoomControl: true,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: true,
                  }}
                >
                  {mockDisasters.map((disaster) => (
                    <Marker
                      key={disaster.id}
                      position={disaster.coordinates}
                      title={`${disaster.type} in ${disaster.location}`}
                      icon={{
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: getMarkerColor(disaster.type),
                        fillOpacity: 0.7,
                        strokeWeight: 1,
                        strokeColor: '#ffffff',
                        scale: 10,
                      }}
                    />
                  ))}
                </GoogleMap>
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded">
                <p>Loading map...</p>
              </div>
            )}
          </div>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Disasters Panel */}
          <div className="bg-card rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Active Disasters</h2>
            <ul className="space-y-4">
              {mockDisasters.map((disaster) => (
                <li key={disaster.id} className="flex items-start p-3 rounded-md hover:bg-gray-50 transition-colors border-l-4 border-l-solid" style={{ borderLeftColor: getMarkerColor(disaster.type) }}>
                  <div className="flex-shrink-0 mr-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full" style={{ 
                      backgroundColor: `${getMarkerColor(disaster.type)}20`, 
                      color: getMarkerColor(disaster.type) 
                    }}>
                      {disaster.type === 'Hurricane' && '🌀'}
                      {disaster.type === 'Wildfire' && '🔥'}
                      {disaster.type === 'Flood' && '💧'}
                      {disaster.type === 'Earthquake' && '⚡'}
                      {!['Hurricane', 'Wildfire', 'Flood', 'Earthquake'].includes(disaster.type) && '⚠️'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{disaster.type} in {disaster.location}</p>
                    <div className="flex items-center mt-1">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        disaster.severity === 'High' ? 'bg-red-100 text-red-700' : 
                        disaster.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {disaster.severity}
                      </span>
                      <span className="text-gray-500 text-xs ml-2">
                        {formatTimeAgo(disaster.date)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Notifications Panel */}
          <div className="bg-card rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Notifications</h2>
            <ul className="space-y-4">
              {mockNotifications.map((notification) => (
                <li key={notification.id} className="flex items-start p-3 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    {notification.type === 'alert' && (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                    {notification.type === 'update' && (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                    {notification.type === 'report' && (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{notification.title}</p>
                    <p className="text-gray-500 text-sm">{notification.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional panels can be added here as needed */}
        </div>
      </div>
    </div>
    </>
  );
};

