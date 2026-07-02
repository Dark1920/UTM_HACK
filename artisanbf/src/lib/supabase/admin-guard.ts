import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Vérifie que l'utilisateur est authentifié ET admin.
 * Retourne { userId } si OK, ou une NextResponse 401/403 sinon.
 */
export async function requireAdmin(
  request: Request
): Promise<{ userId: string } | NextResponse> {
  // 1. Extraire le token du header Authorization
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
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
    return NextResponse.json(
      { error: 'Token invalide ou expiré' },
      { status: 401 }
    );
  }

  // 3. Vérifier que l'utilisateur est admin dans la table utilisateurs
  const { data: profil, error: profilError } = await supabase
    .from('utilisateurs')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profilError || !profil) {
    return NextResponse.json(
      { error: 'Profil utilisateur introuvable' },
      { status: 403 }
    );
  }

  if (profil.role !== 'admin') {
    return NextResponse.json(
      { error: 'Accès réservé aux administrateurs' },
      { status: 403 }
    );
  }

  // 4. Retourner userId si tout est OK
  return { userId: user.id };
}
