import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  const { data: { user } } = await supabase.auth.getUser();

  const protectedRoutes = ['/dashboard', '/admin'];
  const isProtected = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/connexion';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
