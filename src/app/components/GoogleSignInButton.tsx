"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function GoogleSignInButton() {
  const { data: session } = useSession();
  return session ? (
    <button onClick={() => signOut()} className="rounded px-4 py-2 bg-red-600 text-white">
      Sign Out
    </button>
  ) : (
    <button
      onClick={() => signIn("google")}
      className="flex items-center gap-2 rounded px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
    >
      <img src="/google-logo.svg" alt="Google" className="h-5 w-5" />
      Sign in with Google
    </button>
  );
}