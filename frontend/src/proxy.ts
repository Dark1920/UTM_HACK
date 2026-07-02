import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPrefixes = ['/dashboard', '/admin'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next();
  }

  // Check if route is protected
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!isProtected) {
    return NextResponse.next();
  }

  // For protected routes, check for auth token cookie
  // The auth token is stored as 'supabase_token' in localStorage by the frontend
  // and also set as a cookie for the proxy to read
  const token = request.cookies.get('supabase_token')?.value;

  if (!token) {
    // No token — redirect to login with a callback URL
    const loginUrl = new URL('/connexion', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
