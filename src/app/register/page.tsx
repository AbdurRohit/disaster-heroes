// components/RegistrationPage.tsx
"use client"
import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import bg from '../assets/car.jpg';
import Navbar from '../components/Navbar';
import { apiService } from '../services/apiService';

// Define form data type
interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Define errors type
interface FormErrors {
  [key: string]: string;
}

export default function RegistrationPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  
  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = (): void => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    
    // Clear error when user types
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: ''
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Remove the unused confirmPassword variable
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };
      
      const response = await apiService.register(userData);
      
      if (response.success) {
        setIsSuccess(true);
        setPopupMessage('Registration successful! You can now log in.');
        setShowPopup(true);
      } else {
        setIsSuccess(false);
        setPopupMessage(response.error || 'Registration failed. Please try again.');
        setShowPopup(true);
      }
    } catch (err) {
      // Use the error
      console.error('Registration error:', err);
      setIsSuccess(false);
      setPopupMessage('An unexpected error occurred. Please try again.');
      setShowPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close popup
  const closePopup = (): void => {
    setShowPopup(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-6xl rounded-lg overflow-hidden shadow-lg bg-white flex">
          {/* Left side - Image with overlay text */}
          <div className="hidden md:block w-1/2 relative">
            <Image
              src={bg}
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
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
                  <input 
                    type="text" 
                    id="username" 
                    placeholder="Input username" 
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800`}
                  />
                  {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="Input email" 
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      id="password" 
                      placeholder="••••••••••" 
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800`}
                    />
                    <button 
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-3 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      id="confirmPassword" 
                      placeholder="••••••••••" 
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full p-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800`}
                    />
                    <button 
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-3 text-gray-400"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
                
                <p className="text-gray-600 mb-6">
                  By creating an account, you agree to our{' '}
                  <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and{' '}
                  <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                </p>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full p-4 bg-green-800 hover:bg-green-900 text-white font-medium rounded-md transition-colors disabled:bg-green-300"
                >
                  {isSubmitting ? 'Registering...' : 'Register - Start Contributing Today'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success/Error Popup with blurred white background */}
      {showPopup && (
        <div className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <div className="flex items-center mb-4">
              {isSuccess ? (
                <CheckCircle className="text-green-500 mr-2" size={24} />
              ) : (
                <XCircle className="text-red-500 mr-2" size={24} />
              )}
              <h3 className={`text-xl font-semibold ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                {isSuccess ? 'Success' : 'Error'}
              </h3>
            </div>
            <p className="text-gray-700 mb-4">{popupMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={closePopup}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}