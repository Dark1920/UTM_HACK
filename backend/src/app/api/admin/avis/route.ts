// @ts-nocheck
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { createServiceClient } from '@/lib/supabase/api'

export async function GET(request: Request) {
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const supabase = createServiceClient()

  try {
    const { searchParams } = new URL(request.url)
    const filtre = searchParams.get('filtre') || 'tous' // tous | approuves | spam
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const from = (page - 1) * limit
    const to = from + limit - 1

    // Admin voit TOUS les avis (y compris spam)
    let query = supabase
      .from('avis')
      .select('*, utilisateurs(id, nom, prenom), commerces(id, nom, ville)', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false })

    if (filtre === 'approuves') {
      query = query.eq('is_spam', false)
    } else if (filtre === 'spam') {
      query = query.eq('is_spam', true)
    }
    // 'tous' → aucun filtre

    const { data: avis, error, count } = await query

    if (error) {
      console.error('[/api/admin/avis]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Mapper snake_case → camelCase
    const mapped = (avis || []).map((a) => ({
      id: a.id,
      texte: a.commentaire || '',
      note: a.note,
      auteurId: a.user_id,
      auteur: a.utilisateurs
        ? {
            id: a.utilisateurs.id,
            nom: a.utilisateurs.nom,
            prenom: a.utilisateurs.prenom,
          }
        : null,
      commerceId: a.commerce_id,
      commerce: a.commerces
        ? {
            id: a.commerces.id,
            nom: a.commerces.nom,
            ville: a.commerces.ville,
          }
        : null,
      iaScore: a.score_sentiment || undefined,
      iaResume: a.sentiment || undefined,
      estSpam: a.is_spam,
      estModer: a.approuve ?? true,
      dateCreation: a.created_at,
    }))

    return NextResponse.json({
      avis: mapped,
      total: count || 0,
      page,
      limit,
    })
  } catch (error) {
    console.error('[/api/admin/avis]', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
