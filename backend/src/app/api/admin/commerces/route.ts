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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search')

    const from = (page - 1) * limit
    const to = from + limit - 1

    // Admin : pas de filtre est_public, on voit TOUT
    let query = supabase
      .from('commerces')
      .select('*, categories(id, nom, slug), utilisateurs(id, nom, prenom)', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false })

    if (search) {
      const s = `%${search}%`
      query = query.or(`nom.ilike.${s},ville.ilike.${s},adresse.ilike.${s}`)
    }

    const { data: commerces, error, count } = await query

    if (error) {
      console.error('[/api/admin/commerces]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Mapper les colonnes snake_case → camelCase pour le frontend
    const mapped = (commerces || []).map((c) => ({
      id: c.id,
      nom: c.nom,
      description: c.description || '',
      categorieId: c.categorie_id,
      categorie: c.categories || null,
      artisanId: c.artisan_id,
      artisan: c.utilisateurs || null,
      adresse: c.adresse,
      ville: c.ville,
      latitude: c.latitude,
      longitude: c.longitude,
      telephone: c.telephone || '',
      whatsapp: c.whatsapp || undefined,
      email: c.email || undefined,
      photos: c.photos || [],
      note: parseFloat(c.note_moyenne) || 0,
      nombreAvis: c.nombre_avis || 0,
      nombreVues: c.nombre_vues || 0,
      nombreAppels: c.nombre_appels || 0,
      nombreClicsWhatsApp: c.nombre_clics_whatsapp || 0,
      estPublic: c.est_public,
      dateCreation: c.created_at,
      dateModification: c.updated_at,
    }))

    return NextResponse.json({
      commerces: mapped,
      total: count || 0,
      page,
      limit,
    })
  } catch (error) {
    console.error('[/api/admin/commerces]', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
