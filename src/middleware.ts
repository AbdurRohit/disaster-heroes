import { withAuth } from "next-auth/middleware"
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = request.nextUrl;

  // If the user is not authenticated and is trying to access a protected route
  if (!token && pathname.startsWith('/member')) {
    const signInUrl = new URL('/api/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/member/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/report/:path*",
  ]
}