// @ts-nocheck
import { createServiceClient, getUser } from '@/lib/supabase/api'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser(request)
    if (!user) {
      return Response.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const supabase = createServiceClient()

    // Récupère l'avis pour vérifier la propriété et le commerce associé
    const { data: avis, error: fetchError } = await supabase
      .from('avis')
      .select('id, user_id, commerce_id')
      .eq('id', (await params).id)
      .single()

    if (fetchError || !avis) {
      return Response.json({ error: 'Avis non trouvé' }, { status: 404 })
    }

    if (avis.user_id !== user.id) {
      return Response.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const { error } = await supabase.from('avis').delete().eq('id', (await params).id)
    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    // Recalcule la note moyenne du commerce
    const { data: allAvis } = await supabase
      .from('avis')
      .select('note')
      .eq('commerce_id', avis.commerce_id)

    const count = allAvis?.length || 0
    const avg = count > 0
      ? Math.round((allAvis.reduce((sum, a) => sum + a.note, 0) / count) * 100) / 100
      : 0

    await supabase
      .from('commerces')
      .update({ note_moyenne: avg, nombre_avis: count })
      .eq('id', avis.commerce_id)

    return Response.json({ success: true })
  } catch (error) {
    console.error('[/api/avis/[id]]', error)
    return Response.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
