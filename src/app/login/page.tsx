import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  return (
    <>
      <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="px-8 py-10">
          <div className="text-center mb-8">
            <div className="bg-gray-100 rounded-full p-3 inline-block mb-4">
              <svg 
                className="h-6 w-6 text-gray-700" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M11 16l-4-4m0 0l4-4m-4 4h14" 
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Sign in with email</h2>
            <p className="text-gray-500 mt-2">
              Make a new doc to bring your words, data, and teams together. For free
            </p>
          </div>
          
          <form className="space-y-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg 
                    className="h-5 w-5 text-gray-400" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  className="w-full pl-10 pr-3 py-3 bg-gray-100 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email"
                />
              </div>
            </div>
            
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg 
                    className="h-5 w-5 text-gray-400" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg 
                    className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-700" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" 
                    />
                  </svg>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800">Forgot password?</a>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50 transition duration-200"
            >
              Get Started
            </button>
          </form>
          
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm text-gray-500">Or sign in with</span>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="button"
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
              >
                <FaGoogle className="h-5 w-5 text-red-600" />
                <span className="ml-2 text-gray-700 font-medium">Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginPage;