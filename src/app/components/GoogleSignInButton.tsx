import { FC } from 'react';
import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
interface GoogleSignInButtonProps {
  callbackUrl?: string;
}

const GoogleSignInButtonComponent: FC<GoogleSignInButtonProps> = ({ callbackUrl }) => {
  const { data: session } = useSession();
  
  return session ? (
    <button 
      onClick={() => signOut({ callbackUrl: callbackUrl || window.location.href })}
      className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
    >
      <span className="text-gray-700 font-medium">Sign Out</span>
    </button>
  ) : (
    <button
      onClick={() => signIn("google", { callbackUrl: callbackUrl || window.location.href })}
      className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
    >
      <FcGoogle className="h-5 w-5" />
      <span className="ml-2 text-gray-700 font-medium">Continue with Google</span>
    </button>
  );
};

const GoogleSignInButton: FC<GoogleSignInButtonProps> = (props) => {
  return (
    <SessionProvider>
      <GoogleSignInButtonComponent {...props} />
    </SessionProvider>
  );
};

export default GoogleSignInButton;