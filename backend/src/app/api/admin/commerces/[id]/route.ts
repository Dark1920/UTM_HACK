// @ts-nocheck
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { createServiceClient } from '@/lib/supabase/api'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const supabase = createServiceClient()

  try {
    const body = await request.json()
    const { nom, description, categorieId, adresse, ville, latitude, longitude, telephone, whatsapp, email } = body

    // Vérifier que le commerce existe
    const { data: existing, error: findError } = await supabase
      .from('commerces')
      .select('id')
      .eq('id', params.id)
      .single()

    if (findError || !existing) {
      return NextResponse.json({ error: 'Commerce non trouvé' }, { status: 404 })
    }

    const updateData = {}
    if (nom !== undefined) updateData.nom = nom
    if (description !== undefined) updateData.description = description
    if (categorieId !== undefined) updateData.categorie_id = categorieId
    if (adresse !== undefined) updateData.adresse = adresse
    if (ville !== undefined) updateData.ville = ville
    if (latitude !== undefined) updateData.latitude = latitude
    if (longitude !== undefined) updateData.longitude = longitude
    if (telephone !== undefined) updateData.telephone = telephone
    if (whatsapp !== undefined) updateData.whatsapp = whatsapp
    if (email !== undefined) updateData.email = email

    const { data: commerce, error } = await supabase
      .from('commerces')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('[/api/admin/commerces/[id]]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, commerce })
  } catch (error) {
    console.error('[/api/admin/commerces/[id]]', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const supabase = createServiceClient()

  try {
    // Vérifier que le commerce existe
    const { data: existing, error: findError } = await supabase
      .from('commerces')
      .select('id')
      .eq('id', params.id)
      .single()

    if (findError || !existing) {
      return NextResponse.json({ error: 'Commerce non trouvé' }, { status: 404 })
    }

    // Supprimer le commerce (cascade sur avis, signalements)
    const { error } = await supabase
      .from('commerces')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('[/api/admin/commerces/[id]]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, commerceId: params.id })
  } catch (error) {
    console.error('[/api/admin/commerces/[id]]', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
