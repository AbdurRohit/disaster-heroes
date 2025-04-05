// components/RegistrationPage.jsx
"use client"
import { use, useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import bg from '../assets/animated.jpg'
import Navbar from '../components/Navbar';
export default function RegistrationPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
        <Navbar  />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div className="w-full max-w-6xl rounded-lg overflow-hidden shadow-lg bg-white flex">
      {/* Left side - Image with overlay text */}
      <div className="hidden md:block w-1/2 relative">
          <Image
            src= {bg}
            alt="Disaster Response Team" 
            className="w-full h-full object-cover"
          />
          
          {/* Dark overlay with feature list */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 backdrop-blur-sm p-8">
            <div className="mb-6">
              <h3 className="text-white text-xl font-bold mb-2">REAL-TIME ALERTS:</h3>
              <p className="text-white">Get immediate notifications about emergencies in your area.</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-white text-xl font-bold mb-2">RESOURCE COORDINATION:</h3>
              <p className="text-white">Access tools for effective resource management during crises.</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-white text-xl font-bold mb-2">EMERGENCY PROTOCOLS:</h3>
              <p className="text-white">Follow step-by-step guides during different types of disasters.</p>
            </div>
            
            <div>
              <h3 className="text-white text-xl font-bold mb-2">24/7 EMERGENCY SUPPORT:</h3>
              <p className="text-white">Connect with trained professionals during critical situations.</p>
            </div>
          </div>
        </div>
        
        {/* Right side - Registration form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl text-black font-bold mb-2">JOIN RESPONDER AND HELP SAVE LIVES</h1>
            <p className="text-gray-600 mb-8">
              Ready to make a difference during emergencies? Join our disaster management network today and help communities prepare, respond, and recover.
            </p>
            
            <form>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
                <input 
                  type="text" 
                  id="username" 
                  placeholder="Input username" 
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="Input email" 
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    placeholder="••••••••••" 
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  />
                  <button 
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-3 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    id="confirmPassword" 
                    placeholder="••••••••••" 
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  />
                  <button 
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-3 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
              </p>
              
              <button 
                type="submit" 
                className="w-full p-4 bg-green-800 hover:bg-green-900 text-white font-medium rounded-md transition-colors"
              >
                Register - Start Contributing Today
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}