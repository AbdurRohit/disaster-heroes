import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Allow requests to /api/auth
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Protect these routes
  if (pathname.startsWith('/member') || 
      pathname.startsWith('/profile') || 
      pathname.startsWith('/settings') || 
      pathname.startsWith('/report')) {
    
    if (!token) {
      const url = new URL('/api/auth/signin', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/member/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/report/:path*',
    '/api/auth/:path*'
  ]
};