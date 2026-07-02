import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Vérifie que l'utilisateur est authentifié via le header Authorization Bearer.
 * Retourne { userId, email } si OK, ou une NextResponse 401 sinon.
 * 
 * Usage:
 *   const auth = await requireAuth(request);
 *   if (auth instanceof NextResponse) return auth; // 401
 *   const { userId, email } = auth; // OK
 */
export async function requireAuth(
  request: Request
): Promise<{ userId: string; email: string } | NextResponse> {
  // 1. Extraire le token du header Authorization
  const authHeader =
    request.headers.get('authorization') ||
    request.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Token d\'authentification manquant' },
      { status: 401 }
    );
  }

  const token = authHeader.replace('Bearer ', '');

  // 2. Vérifier le token avec le Service Role Key (bypass RLS)
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    console.error('Auth guard - token error:', authError?.message);
    return NextResponse.json(
      { error: 'Token invalide ou expiré' },
      { status: 401 }
    );
  }

  // 3. Retourner userId et email si tout est OK
  return { userId: user.id, email: user.email || '' };
}
