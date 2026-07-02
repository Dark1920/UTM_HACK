// @ts-nocheck
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { createServiceClient } from '@/lib/supabase/api'
import { recalculerNoteCommerce } from '@/lib/utils/recalcul-note'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const supabase = createServiceClient()

  try {
    // Récupérer l'avis pour connaître le commerce_id
    const { data: avis, error: findError } = await supabase
      .from('avis')
      .select('id, commerce_id')
      .eq('id', (await params).id)
      .single()

    if (findError || !avis) {
      return NextResponse.json({ error: 'Avis non trouvé' }, { status: 404 })
    }

    // Supprimer l'avis
    const { error } = await supabase
      .from('avis')
      .delete()
      .eq('id', (await params).id)

    if (error) {
      console.error('[/api/admin/avis/[id]]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Recalculer la note du commerce
    await recalculerNoteCommerce(supabase, avis.commerce_id)

    return NextResponse.json({ success: true, avisId: (await params).id })
  } catch (error) {
    console.error('[/api/admin/avis/[id]]', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
