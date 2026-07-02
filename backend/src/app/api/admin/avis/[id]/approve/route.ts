// @ts-nocheck
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { createServiceClient } from '@/lib/supabase/api'
import { recalculerNoteCommerce } from '@/lib/utils/recalcul-note'

export async function PUT(
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
      .select('id, commerce_id, is_spam')
      .eq('id', (await params).id)
      .single()

    if (findError || !avis) {
      return NextResponse.json({ error: 'Avis non trouvé' }, { status: 404 })
    }

    if (!avis.is_spam) {
      return NextResponse.json({ error: 'Cet avis n\'est pas marqué comme spam' }, { status: 400 })
    }

    // Approuver (enlever le flag spam)
    const { error } = await supabase
      .from('avis')
      .update({ is_spam: false })
      .eq('id', (await params).id)

    if (error) {
      console.error('[/api/admin/avis/[id]/approve]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Recalculer la note du commerce (ré-inclure cet avis)
    await recalculerNoteCommerce(supabase, avis.commerce_id)

    return NextResponse.json({ success: true, avisId: (await params).id, isSpam: false })
  } catch (error) {
    console.error('[/api/admin/avis/[id]/approve]', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
