"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import GoogleSignInButton from "./GoogleSignInButton";

const Login = (props: any) => {
  const [state, setState] = useState(props.isVisible);

  useEffect(() => {
    setState(props.isVisible);
  }, [props.isVisible]);

  return (
    <>
      <div
        style={{ display: state }}
        className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50"
      >
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* top-right close “×” */}
          <button
            onClick={() => props.setIsVisible("none")}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          >
            &times;
          </button>

          <div className="px-8 py-10">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-medium">Sign In</h2>
            </div>

            {/* Google login */}
            <GoogleSignInButton
              // onClick={() =>
              //   signIn("google", { callbackUrl: window.location.href })
              // }
            />

            {/* any other form fields… */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;