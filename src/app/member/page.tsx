"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
  GoogleMap,
  InfoWindow
} from "@react-google-maps/api";
import Navbar from '../components/Navbar';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import ChatRoom from '../components/chat/chatRoom';
import { Suspense } from 'react';


export interface Disaster {
  id: string;
  title: string;
  description: string;
  datetime: string;
  categories: string[];
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  locationLandmark: string;
  newsSourceLink: string | null;
  mediaUrls: string[];
  latitude: number;
  longitude: number;
  locationAddress: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface UserLocation {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  region: string | null;
  country: string | null;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  location: UserLocation | null;
}

export interface DisasterInfo {
  disasters: Disaster[];
  selectedId: string;
}

const disasterService = {
  getActiveDisasters: async (): Promise<Disaster[]> => {
    try {
      const response = await fetch('/api/reports');
      console.log("All report data: ",response.body);
      
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

const userService = {
  getUserProfile: async (email: string): Promise<User | null> => {
    try {
      const response = await fetch(`/api/user-profile?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }
};

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

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

// Create a red flag icon for the markers
const createRedFlagIcon = () => {
  const flagSvg = `
    <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
      <!-- Flag pole -->
      <rect x="2" y="0" width="2" height="40" fill="#8B4513"/>
      <!-- Flag -->
      <path d="M4 2 L24 2 L20 8 L24 14 L4 14 Z" fill="#DC2626" stroke="#B91C1C" stroke-width="1"/>
      <!-- Flag shadow -->
      <path d="M4 14 L24 14 L20 20 L24 26 L4 26 Z" fill="#991B1B" opacity="0.3"/>
    </svg>
  `;
  
  const blob = new Blob([flagSvg], { type: 'image/svg+xml' });
  return URL.createObjectURL(blob);
};


function LoadingAnimation() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
      <div className="relative">
        <div className="w-20 h-20 border-purple-200 border-2 rounded-full"></div>
        <div className="w-20 h-20 border-purple-700 border-t-2 animate-spin rounded-full absolute left-0 top-0"></div>
        <div className="mt-8 text-center">
          <p className="text-lg font-semibold text-purple-700">Loading</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we prepare your dashboard</p>
        </div>
      </div>
    </div>
  );
}

export default function DisasterManagementPage() {
  const { data: session } = useSession();
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [filteredDisasters, setFilteredDisasters] = useState<Disaster[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 20.5937, lng: 78.9629 });
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isFullscreen] = useState(false);
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);
  const [expandedDisaster, setExpandedDisaster] = useState<string | null>(null);
  const [fullscreenMedia, setFullscreenMedia] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'nearby'>('active');
  const mapRef = React.useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [chatRoom, setChatRoom] = useState<string>('');

  // Use shared Google Maps hook
  const { isLoaded } = useGoogleMaps();

  // Clear existing markers
  const clearMarkers = () => {
    markersRef.current.forEach(marker => {
      marker.map = null;
    });
    markersRef.current = [];
  };

  // Function to center map on disaster location
  const centerMapOnDisaster = (disaster: Disaster) => {
    if (mapRef.current) {
      const newCenter = { lat: disaster.latitude, lng: disaster.longitude };
      mapRef.current.panTo(newCenter);
      mapRef.current.setZoom(12); // Zoom in for better view
    }
  };

  const openChat =  (disasterId:string) =>{
    // Logic to open chat related to the disaster
    setIsRightPanelOpen(true);
    setChatRoom(disasterId); //setting chat room based on disaster ID
    
  }

  // Function to toggle disaster expansion
  const toggleDisasterExpansion = (disasterId: string, disaster: Disaster) => {
    if (expandedDisaster === disasterId) {
      setExpandedDisaster(null);
    } else {
      setExpandedDisaster(disasterId);
      openChat(disasterId);
      centerMapOnDisaster(disaster); // Also center map when expanding
    }
  };

  // Create AdvancedMarkerElements
  const createAdvancedMarkers = async (map: google.maps.Map, disasters: Disaster[]) => {
    if (!window.google?.maps?.marker?.AdvancedMarkerElement) {
      console.error('AdvancedMarkerElement not available');
      return;
    }

    // Clear existing markers first
    clearMarkers();

    const flagIconUrl = createRedFlagIcon();

    for (const disaster of disasters) {
      try {
        // Create a pin element with red flag
        const pinElement = new google.maps.marker.PinElement({
          background: getMarkerColor(disaster.title),
          borderColor: '#ffffff',
          glyphColor: '#ffffff',
          scale: 1.2,
        });

        // Create the advanced marker
        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: { lat: disaster.latitude, lng: disaster.longitude },
          map: map,
          title: `${disaster.title} in ${disaster.locationAddress}`,
          content: pinElement.element,
          collisionBehavior: google.maps.CollisionBehavior.REQUIRED,
        });

        // Add click listener
        marker.addListener('click', () => {
          // You can add custom click behavior here
          console.log('Disaster clicked:', disaster.title);
          setSelectedDisaster(disaster);
        });

        markersRef.current.push(marker);
      } catch (error) {
        console.error('Error creating marker for disaster:', disaster.id, error);
      }
    }

    // Clean up the blob URL
    URL.revokeObjectURL(flagIconUrl);
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const disastersData = await disasterService.getActiveDisasters();
        setDisasters(disastersData);
        
        // Fetch user location if session exists
        if (session?.user?.email) {
          const userData = await userService.getUserProfile(session.user.email);
          if (userData?.location) {
            setUserLocation(userData.location);
            
            // Filter disasters within 20km radius
            const filtered = disastersData.filter(disaster => {
              if (userData.location?.latitude && userData.location?.longitude) {
                const distance = calculateDistance(
                  userData.location.latitude,
                  userData.location.longitude,
                  disaster.latitude,
                  disaster.longitude
                );
                return distance <= 20; // 20km radius
              }
              return false;
            });
            
            setFilteredDisasters(filtered);
            
            // Set map center to user location if available
            if (userData.location.latitude && userData.location.longitude) {
              setMapCenter({ 
                lat: userData.location.latitude, 
                lng: userData.location.longitude 
              });
            }
          } else {
            // If no user location, show all disasters
            setFilteredDisasters(disastersData);
            // Set map center to first disaster if available
            if (disastersData.length > 0) {
              setMapCenter({ lat: disastersData[0].latitude, lng: disastersData[0].longitude });
            }
          }
        } else {
          // If no session, show all disasters
          setFilteredDisasters(disastersData);
          if (disastersData.length > 0) {
            setMapCenter({ lat: disastersData[0].latitude, lng: disastersData[0].longitude });
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  // Update markers when filtered disasters change or map loads
  useEffect(() => {
    if (mapRef.current && isLoaded) {
      const disastersToShow = activeTab === 'nearby' ? filteredDisasters : disasters;
      if (disastersToShow.length > 0) {
        createAdvancedMarkers(mapRef.current, disastersToShow);
      }
    }
    
    return () => {
      clearMarkers();
    };
  }, [filteredDisasters, disasters, activeTab, isLoaded]);

  // Show loading state
  if (loading && !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p style={{ color: 'var(--text-primary)' }}>Loading disaster management dashboard...</p>
        </div>
      </div>
    );
  }

  // Mock data for development (will be replaced by API data)
  const getCurrentDisasters = (): Disaster[] => {
    return activeTab === 'nearby' ? filteredDisasters : disasters;
  };

  const mockDisasters: Disaster[] = getCurrentDisasters();

  // Get marker color based on disaster type
  const getMarkerColor = (disasterType: string): string => {
    switch (disasterType.toLowerCase()) {
      case 'hurricane':
        return '#3B82F6'; // blue
      case 'wildfire':
        return '#DC2626'; // red
      case 'flood':
        return '#2563EB'; // blue
      case 'earthquake':
        return '#6B7280'; // gray
      default:
        return '#EAB308'; // yellow
    }
  };

  return (
    <Suspense fallback={<LoadingAnimation />}>
      <div className="h-screen flex flex-col" style={{ background: 'var(--background)' }}>
        <div className='pb-20'>
          <Navbar />
        </div>
      <div className="flex-1 relative overflow-hidden pt-16">
        {/* Map Container with Controls */}
        <div className="absolute inset-0 flex">
          {/* Left Panel */}
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ 
              x: isLeftPanelOpen ? 0 : -10,
              opacity: 1,
              width: isLeftPanelOpen ? '450px' : '40px'
            }}
            transition={{ type: "tween",
               ease: "easeInOut",
               stiffness: 100,
               duration: 0.2 }}
            className={`backdrop-blur-sm rounded-lg shadow-lg overflow-hidden flex h-[calc(100vh-5rem)] m-4 ${isFullscreen ? 'fixed inset-0 z-50 m-0 rounded-none' : ''}`}
            style={{ 
              backgroundColor: 'var(--card-bg)', 
              height: 'calc(100vh - 5rem)' 
            }}
          >
            {/* Toggle Button */}
            <button
              onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
              className="p-1 hover:opacity-80 transition-colors"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-3 transform transition-transform ${isLeftPanelOpen ? 'rotate-0' : 'rotate-180'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ color: 'var(--footer)' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Panel Content */}
            {isLeftPanelOpen && (
              <div className="flex-1 p-4 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Disaster Reports
                  </h2>
                </div>

                {/* Animated Toggle Switch */}
                <div className="relative mb-4 rounded-full p-1" style={{ backgroundColor: 'var(--primary)' }}>
                  {/* Animated Background Pill */}
                  <motion.div
                    className="absolute top-1 bottom-1 rounded-full bg-white shadow-sm"
                    initial={false}
                    animate={{
                      left: activeTab === 'active' ? '4px' : '50%',
                      right: activeTab === 'active' ? '50%' : '4px',
                    }}
                    transition={{
                      type: "tween",
                      stiffness: 300,
                      damping: 30,
                      duration: 0.3
                    }}
                  />
                  
                  {/* Tab Buttons */}
                  <div className="relative flex">
                    <button
                      onClick={() => setActiveTab('active')}
                      className="flex-1 py-2 px-4 text-sm font-medium rounded-full transition-colors duration-200 relative z-10"
                      style={{
                        color: activeTab === 'active' ? 'var(--primary)' : 'white'
                      }}
                    >
                      All Active
                    </button>
                    <button
                      onClick={() => setActiveTab('nearby')}
                      className="flex-1 py-2 px-4 text-sm font-medium rounded-full transition-colors duration-200 relative z-10"
                      style={{
                        color: activeTab === 'nearby' ? 'var(--primary)' : 'white'
                      }}
                    >
                      Nearby
                    </button>
                  </div>
                </div>

                {/* Tab Content Description */}
                <div className="mb-3">
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {activeTab === 'active' 
                      ? 'Showing all active disaster reports'
                      : userLocation 
                        ? 'Showing disasters within 20km of your location'
                        : 'Sign in to see disasters near you'
                    }
                  </p>
                </div>

                <div className="overflow-y-auto flex-1">
                  <div className="space-y-2">
                    {mockDisasters.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--card)' }}>
                          <svg className="w-8 h-8" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {activeTab === 'active' 
                            ? 'No active disasters at this time'
                            : userLocation 
                              ? 'No disasters found within 20km of your location' 
                              : 'Please sign in to see disasters near you'
                          }
                        </p>
                      </div>
                    ) : (
                      mockDisasters.map((disaster) => (
                        <motion.div
                          key={disaster.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-md shadow-sm border-l-4 overflow-hidden"
                          style={{ 
                            backgroundColor: 'var(--background)',
                            borderLeftColor: getMarkerColor(disaster.title) 
                          }}
                        >
                          {/* Main disaster item - clickable header */}
                          <div 
                            className="p-3 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => toggleDisasterExpansion(disaster.id, disaster)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{disaster.title}</p>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{disaster.locationAddress}</p>
                                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                                  {formatTimeAgo(disaster.datetime)}
                                </p>
                              </div>
                              <div className="ml-2 flex items-center">
                                {disaster.mediaUrls && disaster.mediaUrls.length > 0 && (
                                  <span className="text-xs px-2 py-1 rounded-full mr-2" style={{ backgroundColor: 'var(--card)', color: 'var(--text-secondary)' }}>
                                    {disaster.mediaUrls.length} files
                                  </span>
                                )}
                                <svg 
                                  className={`w-4 h-4 transform transition-transform ${expandedDisaster === disaster.id ? 'rotate-180' : 'rotate-0'}`}
                                  style={{ color: 'var(--text-secondary)' }}
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Expanded content */}
                          {expandedDisaster === disaster.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t border-gray-200"
                              style={{ borderColor: 'var(--card)' }}
                            >
                              <div className="p-3 space-y-3">
                                {/* Description */}
                                <div>
                                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                                    {disaster.description}
                                  </p>
                                </div>

                                {/* Categories */}
                                {disaster.categories && disaster.categories.length > 0 && (
                                  <div>
                                    <div className="flex flex-wrap gap-1">
                                      {disaster.categories.map((category, index) => (
                                        <span 
                                          key={index}
                                          className="text-xs px-2 py-1 rounded-full"
                                          style={{ backgroundColor: 'var(--card)', color: 'var(--text-secondary)' }}
                                        >
                                          {category}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Contact info if available */}
                                {disaster.fullName && (
                                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                    <p>Reported by: {disaster.fullName}</p>
                                  </div>
                                )}

                                {/* Media files */}
                                {disaster.mediaUrls && disaster.mediaUrls.length > 0 && (
                                  <div>
                                    <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                                      Media Files ({disaster.mediaUrls.length})
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                      {disaster.mediaUrls.slice(0, 6).map((url, index) => (
                                        <div 
                                          key={index}
                                          className="relative aspect-square rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setFullscreenMedia(url);
                                          }}
                                        >
                                          <img
                                            src={url}
                                            alt={`Media ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              e.currentTarget.style.display = 'none';
                                            }}
                                          />
                                          {/* Play icon overlay for videos (optional) */}
                                          {url.includes('video') && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z"/>
                                              </svg>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                      {disaster.mediaUrls.length > 6 && (
                                        <div 
                                          className="aspect-square rounded-md flex items-center justify-center cursor-pointer"
                                          style={{ backgroundColor: 'var(--card)' }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            // Show all media in fullscreen or modal
                                            setFullscreenMedia(disaster.mediaUrls[6]);
                                          }}
                                        >
                                          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                                            +{disaster.mediaUrls.length - 6} more
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Map Container */}
          <div className="flex-1 relative">
            {isLoaded ? (
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
                  gestureHandling: 'greedy',
                }}
                onLoad={async (map) => {
                  mapRef.current = map;
                  
                  // Import the marker library
                  try {
                    await google.maps.importLibrary("marker");
                    const disastersToShow = activeTab === 'nearby' ? filteredDisasters : disasters;
                    if (disastersToShow.length > 0) {
                      createAdvancedMarkers(map, disastersToShow);
                    }
                  } catch (error) {
                    console.error('Error importing marker library:', error);
                  }
                }}
              >
                {/* AdvancedMarkers are created programmatically */}
                {selectedDisaster && (
                  <InfoWindow
                    position={{ lat: selectedDisaster.latitude, lng: selectedDisaster.longitude }}
                    onCloseClick={() => setSelectedDisaster(null)}
                    options={{
                      maxWidth: 320,
                      pixelOffset: new google.maps.Size(0, -30)
                    }}
                  >
                    <div className="p-4 max-w-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getMarkerColor(selectedDisaster.title) }}
                          ></div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {selectedDisaster.categories[0] || 'Emergency'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(selectedDisaster.datetime)}
                        </span>
                      </div>

                      {/* Title and Description */}
                      <div className="mb-4">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">
                          {selectedDisaster.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {selectedDisaster.description}
                        </p>
                      </div>

                      {/* Location */}
                      <div className="mb-4 flex items-start gap-2">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-600">{selectedDisaster.locationAddress}</p>
                          {selectedDisaster.locationLandmark && (
                            <p className="text-xs text-gray-500 mt-1">Near {selectedDisaster.locationLandmark}</p>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 ">
                        <button 
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                          onClick={() => {
                            // Handle live chat functionality
                            console.log('Opening live chat for disaster:', selectedDisaster.id);
                            // You can integrate with your chat system here
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Live Chat
                        </button>
                  
                      </div>

                      {/* Media count if available */}
                      {selectedDisaster.mediaUrls && selectedDisaster.mediaUrls.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{selectedDisaster.mediaUrls.length} media file{selectedDisaster.mediaUrls.length !== 1 ? 's' : ''} attached</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--card)' }}>
                <p style={{ color: 'var(--text-primary)' }}>Loading map...</p>
              </div>
            )}
          </div>

          {/* Right Chat Panel */}
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ 
              x: isRightPanelOpen ? 0 : 10,
              opacity: 1,
              width: isRightPanelOpen ? '400px' : '40px'
            }}
            transition={{ type: "tween",
              ease: "easeInOut",
              // damping: 20, 
              // stiffness: 100,
              duration: 0.2 }} 
            className={`backdrop-blur-sm rounded-lg shadow-lg overflow-hidden flex h-[calc(100vh-5rem)] m-1  ${isFullscreen ? 'fixed inset-0 z-50 m-0 rounded-none' : ''}`}
            style={{ backgroundColor: 'var(--card-bg)' }}
          >
            

            {/* Panel Content */}
            {isRightPanelOpen && (
              <div className="flex-1 p-1 flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Live Chat</h2>
                  <div className="flex items-center gap-2">
                    <div className="text-sm flex items-center gap-2" style={{ color: 'var(--footer)' }}>
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      Online 2
                    </div>
                  
                    {/* <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {isFullscreen ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0l5 5m-5-5v5m16-5l-5 5m5-5v5m0-5h-5M4 20l5-5m-5 5v-5m5 5H4m16 0l-5-5m5 5v-4m0 4h-4" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        )}
                      </svg>
                    </button> */}
                  </div>
                </div>
                <div className="flex-1 rounded-lg p-4" style={{ backgroundColor: 'var(--card)' }}>
                  <div className="flex flex-col gap-4">
                    <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>Test Chat Room</p>
                {/* chatroom component */}
                <ChatRoom disasters={disasters} selectedId={chatRoom}/> 
                  </div>
                </div>
              </div>
            )}

            {/* Toggle Button */}
            <button
              onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
              className="p-1 hover:opacity-80 transition-colors"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-3 transform transition-transform ${isRightPanelOpen ? 'rotate-180' : 'rotate-0'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ color: 'var(--footer)' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l-7-7 7-7" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Fullscreen Media Modal */}
      {fullscreenMedia && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={() => setFullscreenMedia(null)}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            {/* Close button */}
            <button
              onClick={() => setFullscreenMedia(null)}
              className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Media content */}
            <div 
              className="max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {fullscreenMedia.includes('video') ? (
                <video
                  src={fullscreenMedia}
                  controls
                  autoPlay
                  className="max-w-full max-h-[90vh] object-contain"
                  onError={(e) => {
                    console.error('Error loading video:', e);
                  }}
                />
              ) : (
                <img
                  src={fullscreenMedia}
                  alt="Fullscreen media"
                  className="max-w-full max-h-[90vh] object-contain"
                  onError={(e) => {
                    console.error('Error loading image:', e);
                    setFullscreenMedia(null);
                  }}
                />
              )}
            </div>

            {/* Navigation arrows for multiple media (optional enhancement) */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black bg-opacity-50 text-white text-sm">
                <span>Click outside to close</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
    </Suspense>
  );
}

