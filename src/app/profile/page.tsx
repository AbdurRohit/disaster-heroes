"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import Image from "next/image"; 

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
  useTheme();
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
            console.log("dataloaded", data); //data loaded
            setUserProfile(data);

            const locationRes = await fetch('https://ipinfo.io/json');
            const locationData: UserLocationData = await locationRes.json();
            
            if(data.location!== null && data.phoneNumber !== null){ 
            setUserProfile({
              name: session.user.name || '',
              email: session.user.email,
              phoneNumber: data.phoneNumber,
              location: data.location,
              disasterUpdates: false
            });
          }else{
            setUserProfile({
              name: session.user.name || '',
              email: session.user.email,
              phoneNumber: '',
              location: locationData,
              disasterUpdates: false
            });
          }

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


  

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-footer-900 via-gray-900 to-footer">
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-card/90 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-white/10">
            <div className="flex flex-col items-center space-y-4 mb-8">
              {session.user?.image ? (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-75 animate-pulse-slow group-hover:opacity-100 transition duration-1000"></div>
                  <Image
                    src={session.user.image} 
                    width={96}
                    height={96}
                    alt="Profile" 
                    className="relative h-24 w-24 rounded-full ring-2 ring-white/20 shadow-lg"
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                  <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center ring-2 ring-white/20 shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              <h1 className="text-3xl font-bold text-cardtext bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                {session.user?.name}
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-medium text-cardtext mb-2 group-hover:text-blue-400 transition-colors">Hero Name</label>
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full px-4 py-3 rounded-lg border border-white/10 bg-background/50 text-footer shadow-lg backdrop-blur-sm
                             hover:border-blue-500/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:ring-opacity-50 
                             transition-all duration-300 ease-in-out"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-cardtext mb-2 group-hover:text-blue-400 transition-colors">Phone Number</label>
                  <input
                    type="tel"
                    value={userProfile.phoneNumber}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+1234567890"
                    className="mt-1 block w-full px-4 py-3  rounded-lg border border-white/10 bg-background/50 text-footer shadow-lg backdrop-blur-sm
                             hover:border-blue-500/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:ring-opacity-50 
                             transition-all duration-300 ease-in-out"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-cardtext mb-2 group-hover:text-blue-400 transition-colors">Location</label>
                  <div className="mt-1 flex items-center space-x-2">
                    <input
                      type="text"
                      value={userProfile.location?.city}
                      readOnly
                      className="block w-full px-4 py-3 rounded-lg border border-white/10 bg-background/50 text-footer shadow-lg backdrop-blur-sm
                                 hover:bg-opacity-75 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:ring-opacity-50 
                                 transition-all duration-300 ease-in-out"/>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="inline-flex items-center px-4 py-3 border border-white/10 shadow-lg text-sm font-medium rounded-lg 
                                 text-cardtext bg-card/50 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                 focus:ring-blue-500 transition-all duration-300 ease-in-out backdrop-blur-sm"
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
                <div className="flex items-center space-x-3">
                  <label className="inline-flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={userProfile.disasterUpdates}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, disasterUpdates: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full 
                        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                        after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                        after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-indigo-600"></div>
                    </div>
                    <span className="ml-3 text-sm text-cardtext">Get disaster updates</span>
                  </label>
                </div>
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="group w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-lg font-semibold
                           bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg
                           hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                           disabled:opacity-50 transition-all duration-300 ease-in-out"
                >
                  <span className="inline-flex items-center">
                    {isSaving ? 'Saving...' : 'Save Changes'}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}