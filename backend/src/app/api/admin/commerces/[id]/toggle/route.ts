// @ts-nocheck
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { createServiceClient } from '@/lib/supabase/api'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const supabase = createServiceClient()

  try {
    // Récupérer l'état actuel
    const { data: commerce, error: findError } = await supabase
      .from('commerces')
      .select('id, est_public')
      .eq('id', (await params).id)
      .single()

    if (findError || !commerce) {
      return NextResponse.json({ error: 'Commerce non trouvé' }, { status: 404 })
    }

    const nouvelEtat = !commerce.est_public

    const { error } = await supabase
      .from('commerces')
      .update({ est_public: nouvelEtat })
      .eq('id', (await params).id)

    if (error) {
      console.error('[/api/admin/commerces/[id]/toggle]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      commerceId: (await params).id,
      estPublic: nouvelEtat,
    })
  } catch (error) {
    console.error('[/api/admin/commerces/[id]/toggle]', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
