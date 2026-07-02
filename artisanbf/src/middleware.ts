import { NextResponse, type NextRequest } from 'next/server';

const allowedOrigins = [
  'http://localhost:3001',
  'http://localhost:3000',
  process.env.NEXT_PUBLIC_APP_URL || '',
].filter(Boolean);

export function middleware(request: NextRequest) {
  // Handle CORS preflight (OPTIONS) requests
  if (request.method === 'OPTIONS') {
    const origin = request.headers.get('origin') || '';
    const isAllowed = allowedOrigins.includes(origin);

    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': isAllowed ? origin : '',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Add CORS headers to all API responses
  const response = NextResponse.next();
  const origin = request.headers.get('origin') || '';
  const isAllowed = allowedOrigins.includes(origin);

  if (isAllowed) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
