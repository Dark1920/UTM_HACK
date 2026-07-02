import { NextResponse } from 'next/server'
import { createServiceClient } from './api'

interface AdminAuth {
  userId: string
  user: {
    id: string
    nom: string
    prenom: string
    role: string
    email?: string
  }
}

/**
 * Vérifie que la requête provient d'un utilisateur authentifié avec le rôle admin.
 * Retourne soit les données de l'admin (succès), soit une NextResponse d'erreur (401/403).
 *
 * Usage :
 *   const auth = await requireAdmin(request)
 *   if (auth instanceof NextResponse) return auth
 *   // auth.userId est disponible
 */
export async function requireAdmin(request: Request): Promise<AdminAuth | NextResponse> {
  const authHeader = request.headers.get('authorization')

  if (!authHeader) {
    return NextResponse.json(
      { error: 'Non authentifié', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }

  const token = authHeader.replace('Bearer ', '')
  const supabase = createServiceClient()

  // Valider le token
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Session invalide', code: 'INVALID_TOKEN' },
      { status: 401 }
    )
  }

  // Vérifier le rôle admin dans la table utilisateurs
  const { data: profil, error: profilError } = await supabase
    .from('utilisateurs')
    .select('id, nom, prenom, role')
    .eq('id', user.id)
    .single()

  if (profilError || !profil) {
    return NextResponse.json(
      { error: 'Profil non trouvé', code: 'PROFILE_NOT_FOUND' },
      { status: 401 }
    )
  }

  if (profil.role !== 'admin') {
    return NextResponse.json(
      { error: 'Accès réservé aux administrateurs', code: 'FORBIDDEN' },
      { status: 403 }
    )
  }

  return {
    userId: profil.id,
    user: {
      id: profil.id,
      nom: profil.nom,
      prenom: profil.prenom,
      role: profil.role,
    },
  }
}
