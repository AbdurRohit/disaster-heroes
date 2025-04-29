"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";

interface UserLocationData {
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  postal?: string;
  timezone?: string;
}

interface UserProfile {
  name: string;
  email: string;
  phoneNumber: string;
  location: UserLocationData;
  disasterUpdates: boolean;
}

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phoneNumber: '',
    location: {
      city: '',
      region: '',
      country: '',
      loc: '',
      ip: ''
    },
    disasterUpdates: false
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (session?.user?.email) {
        try {
          // First try to get existing profile from our database
          const response = await fetch(`/api/user-profile?email=${session.user.email}`);
          if (response.ok) {
            const data = await response.json();
            setUserProfile(data);
          } else {
            // If no profile exists, get location from IP
            const locationRes = await fetch('https://ipinfo.io/json');
            const locationData: UserLocationData = await locationRes.json();
            
            setUserProfile({
              name: session.user.name || '',
              email: session.user.email,
              phoneNumber: '',
              location: locationData,
              disasterUpdates: false
            });
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      }
      setIsLoading(false);
    };

    loadUserProfile();
  }, [session]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserProfile(prev => ({
            ...prev,
            location: {
              ...prev.location,
              loc: `${latitude},${longitude}`
            }
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location');
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch('/api/user-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userProfile),
      });
      
      if (!response.ok) throw new Error('Failed to save profile');
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || isLoading) {
    return <div className="text-foreground">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const formatLocation = (location: UserLocationData) => {
    if (!location) return '';
    const parts = [location.city, location.region, location.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : '';
  };

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-footer">
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-card rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              {session.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt="Profile" 
                  className="h-20 w-20 rounded-full"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-background flex items-center justify-center">
                  <span className="text-2xl text-cardtext">
                    {session.user?.name?.[0]}
                  </span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-cardtext mb-2">Name</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 bg-background text-foreground shadow-sm backdrop-blur-sm 
                             hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                             transition-all duration-200 ease-in-out"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cardtext mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={userProfile.phoneNumber}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="+1234567890"
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 bg-background text-foreground shadow-sm backdrop-blur-sm 
                             hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                             transition-all duration-200 ease-in-out"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cardtext mb-2">Location</label>
                <div className="mt-1 flex items-center space-x-2">
                  <input
                    type="text"
                    value={formatLocation(userProfile.location)}
                    readOnly
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-background text-foreground shadow-sm backdrop-blur-sm 
                               hover:bg-opacity-75 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                               transition-all duration-200 ease-in-out"
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="inline-flex items-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg 
                               text-cardtext bg-card hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 
                               focus:ring-blue-500 transition-all duration-200 ease-in-out backdrop-blur-sm"
                  >
                    Get Current Location
                  </button>
                </div>
                {userProfile.location?.loc && (
                  <p className="mt-1 text-sm text-cardtext">
                    Coordinates: {userProfile.location.loc}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={userProfile.disasterUpdates}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, disasterUpdates: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-background"
                  />
                  <span className="ml-2 text-sm text-cardtext">Get disaster updates</span>
                </label>
              </div>

              <div className="pt-5">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-card bg-footer hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}