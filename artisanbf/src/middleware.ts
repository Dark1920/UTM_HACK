// Middleware Next.js pour la protection des routes
import { createMiddlewareClient } from '@/lib/supabase/middleware';
import { NextRequest, NextResponse } from 'next/server';

// Routes protégées nécessitant une authentification
const protectedRoutes = ['/dashboard', '/admin'];

// Routes admin nécessitant le rôle admin
const adminRoutes = ['/admin'];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient(request, response);

  // Vérifier la session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  // Si la route est protégée et pas de session → redirect vers connexion
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!session) {
      const redirectUrl = new URL('/connexion', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Vérifier le rôle admin pour les routes admin
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      const { data: profil } = await supabase
        .from('utilisateurs')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profil?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  // Si l'utilisateur est connecté et essaie d'accéder à connexion/inscription → redirect dashboard
  if (session && (pathname === '/connexion' || pathname === '/inscription')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

// Configuration du matcher pour les routes à protéger
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/connexion',
    '/inscription',
  ],
};
