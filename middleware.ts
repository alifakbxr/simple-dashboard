import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '@/types/auth';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// Force Node.js runtime for middleware to support JWT
export const runtime = 'nodejs';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
                          request.nextUrl.pathname.startsWith('/users') ||
                          request.nextUrl.pathname.startsWith('/analytics');

  // Check if user is trying to access login page while authenticated
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/') {
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        const now = Math.floor(Date.now() / 1000);

        if (decoded.exp >= now) {
          // User is authenticated and token is valid, redirect to dashboard
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } catch (error) {
        // Token is invalid, clear it and allow access to login
        const response = NextResponse.next();
        response.cookies.delete('auth-token');
        response.cookies.delete('refresh-token');
        return response;
      }
    }

    // User is not authenticated, allow access to login page
    return NextResponse.next();
  }

  // Allow access to API routes without authentication checks
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  if (isProtectedRoute) {
    if (!token) {
      console.log('No auth token found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

      // Check if token is expired (additional safety check)
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp < now) {
        console.log('Token expired, redirecting to login');
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Add user info to request headers for use in pages (optional)
      const response = NextResponse.next();
      response.headers.set('X-User-ID', decoded.userId.toString());
      response.headers.set('X-Username', decoded.username);

      return response;

    } catch (error) {
      console.error('JWT verification failed:', error instanceof Error ? error.message : 'Unknown error');

      // Clear invalid cookies
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      response.cookies.delete('refresh-token');

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/users/:path*',
    '/analytics/:path*',
    '/login',
    '/api/:path*'
  ],
};