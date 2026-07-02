// @ts-nocheck
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { createServiceClient } from '@/lib/supabase/api'

const createSchema = z.object({
  commerce_id: z.string().uuid().optional(),
  avis_id: z.string().uuid().optional(),
  raison: z.string().min(1, 'La raison est requise'),
  description: z.string().optional(),
})

export async function GET(request: Request) {
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const supabase = createServiceClient()

  try {
    const { searchParams } = new URL(request.url)
    const statut = searchParams.get('statut') // pending | resolved | dismissed | all

    let query = supabase
      .from('signalements')
      .select(`
        *,
        signaleur:utilisateurs!signalements_signaleur_id_fkey(id, nom, prenom),
        commerce:commerces(id, nom, ville),
        avis(id, commentaire)
      `)
      .order('created_at', { ascending: false })

    if (statut && statut !== 'all') {
      query = query.eq('statut', statut)
    }

    const { data: signalements, error } = await query

    if (error) {
      console.error('[/api/admin/signalements]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Mapper les données
    const mapped = (signalements || []).map((s) => ({
      id: s.id,
      signaleur: s.signaleur
        ? `${s.signaleur.prenom || ''} ${s.signaleur.nom || ''}`.trim()
        : 'Inconnu',
      commentaireTexte: s.avis?.commentaire || '',
      commerce: s.commerce?.nom || 'Inconnu',
      commerceId: s.commerce_id,
      avisId: s.avis_id,
      raison: s.raison,
      description: s.description || '',
      date: s.created_at,
      statut: s.statut,
      noteModerateur: s.note_moderateur || '',
      resoluPar: s.resolu_par,
      resoluLe: s.resolu_le,
    }))

    return NextResponse.json(mapped)
  } catch (error) {
    console.error('[/api/admin/signalements]', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const supabase = createServiceClient()

  try {
    const body = await request.json()
    const parsed = createSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { commerce_id, avis_id, raison, description } = parsed.data

    if (!commerce_id && !avis_id) {
      return NextResponse.json(
        { error: 'Au moins un commerce_id ou avis_id est requis' },
        { status: 400 }
      )
    }

    const { data: signalement, error } = await supabase
      .from('signalements')
      .insert({
        signaleur_id: auth.userId,
        commerce_id: commerce_id || null,
        avis_id: avis_id || null,
        raison,
        description: description || null,
        statut: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('[/api/admin/signalements]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(signalement, { status: 201 })
  } catch (error) {
    console.error('[/api/admin/signalements]', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
