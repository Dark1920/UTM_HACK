import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Recalcule note_moyenne et nombre_avis d'un commerce
 * en excluant les avis is_spam = true.
 */
export async function recalculerNoteCommerce(
  supabase: SupabaseClient,
  commerceId: string
): Promise<void> {
  const { data: avis } = await supabase
    .from('avis')
    .select('note')
    .eq('commerce_id', commerceId)
    .eq('is_spam', false)

  const count = avis?.length || 0
  const avg = count > 0
    ? Math.round((avis.reduce((sum, a) => sum + a.note, 0) / count) * 100) / 100
    : 0

  await supabase
    .from('commerces')
    .update({ note_moyenne: avg, nombre_avis: count })
    .eq('id', commerceId)
}
