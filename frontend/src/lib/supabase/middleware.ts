import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { env } from '@/lib/env';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Lire le token depuis le cookie (déposé par le frontend lors du login)
  const token = request.cookies.get('supabase_token')?.value;

  const protectedRoutes = ['/dashboard', '/admin'];
  const isProtected = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/connexion';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
