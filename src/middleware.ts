import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieName = isProduction ? '__Secure-better-auth.session_token' : 'better-auth.session_token';
  const sessionToken = request.cookies.get(cookieName)?.value || request.cookies.get('better-auth.session_token')?.value;
  
  const { pathname } = request.nextUrl;

  // 1. Basic protection: If no token, redirect to login from dashboard
  if (pathname.startsWith('/dashboard') && !sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Prevent logged-in users from seeing login/register
  if (sessionToken && (pathname === '/login' || pathname === '/register')) {
    try {
      // Cleanly fetch session to avoid loops on invalid tokens
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const cleanApiBase = apiBase.replace(/\/api\/v1\/?$/, "");
      
      const response = await fetch(`${cleanApiBase}/api/v1/auth/get-session`, {
        headers: {
          cookie: `${cookieName}=${sessionToken}`
        }
      });
      
      if (response.ok) {
        const session = await response.json();
        if (session && session.user) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
    } catch (error) {
      // If verification fails, allow staying on login/register
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};

