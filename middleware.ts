import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * @runtime nodejs
 * Force Node.js runtime for JWT support
 */

// Force Node.js runtime for middleware to support JWT
export const runtime = 'nodejs';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
                          request.nextUrl.pathname.startsWith('/users') ||
                          request.nextUrl.pathname.startsWith('/analytics');

  // Check if user is trying to access login page while authenticated
   if (request.nextUrl.pathname === '/login') {
     if (token) {
       try {
         // Use API route for token verification (runs in Node.js runtime)
         const verifyResponse = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({ token }),
         });

         const verifyResult = await verifyResponse.json();

         if (verifyResult.valid) {
           // User is authenticated and token is valid, redirect to dashboard
           return NextResponse.redirect(new URL('/dashboard', request.url));
         } else {
           // Token is invalid, clear it and allow access to login
           const response = NextResponse.next();
           response.cookies.delete('auth-token');
           response.cookies.delete('refresh-token');
           return response;
         }

       } catch (error) {
         // Token verification failed, clear it and allow access to login
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
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Use API route for token verification (runs in Node.js runtime)
      const verifyResponse = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const verifyResult = await verifyResponse.json();

      if (verifyResult.valid) {
        // Add user info to request headers for use in pages (optional)
        const response = NextResponse.next();
        response.headers.set('X-User-ID', verifyResult.user.id.toString());
        response.headers.set('X-Username', verifyResult.user.username);

        return response;
      } else {
        // Clear invalid cookies and redirect to login
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('auth-token');
        response.cookies.delete('refresh-token');

        return response;
      }

    } catch (error) {
      // Clear invalid cookies and redirect to login
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