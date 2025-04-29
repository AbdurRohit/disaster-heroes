"use client";

import { useSession } from 'next-auth/react';
import GoogleSignInButton from "./GoogleSignInButton";
import { useEffect } from 'react';

interface LoginProps {
  isVisible: string;
  setIsVisible: (value: string) => void;
}

const Login = ({ isVisible, setIsVisible }: LoginProps) => {
  const { data: session } = useSession();

  // Close modal if user is authenticated
  useEffect(() => {
    if (session) {
      setIsVisible("none");
    }
  }, [session, setIsVisible]);

  if (isVisible === "none") return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden relative">
        <button
          onClick={() => setIsVisible("none")}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="px-8 py-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 mt-2">
              Sign in to access your account and help save lives
            </p>
          </div>
          
          <div className="mt-8">
            <GoogleSignInButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;