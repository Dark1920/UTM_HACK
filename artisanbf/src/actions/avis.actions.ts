// Server Actions pour la gestion des avis
// @ts-nocheck - Types Supabase seront générés après configuration
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAvisSchema, updateAvisSchema, deleteAvisSchema } from '@/lib/validations/avis.schema';
import { actionResponse } from '@/lib/utils';
import { checkRateLimit, avisRateLimiter } from '@/lib/ratelimit/upstash';
import type { AnalyseIAResult } from '@/types/ia';

/**
 * Créer un avis sur un commerce
 */
export async function createAvis(formData: FormData) {
  try {
    const supabase = createClient();

    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return actionResponse(false, null, 'Vous devez être connecté');
    }

    const rawData = {
      commerceId: formData.get('commerceId'),
      note: parseInt(formData.get('note') as string),
      commentaire: formData.get('commentaire'),
    };

    // Validation Zod
    const validated = createAvisSchema.parse(rawData);

    // Rate limiting
    const { success: rateLimitSuccess } = await checkRateLimit(
      avisRateLimiter,
      user.id
    );

    if (!rateLimitSuccess) {
      return actionResponse(false, null, 'Trop de tentatives. Réessayez plus tard.');
    }

    // Vérifier si l'utilisateur a déjà donné un avis
    const { data: existingAvis } = await supabase
      .from('avis')
      .select('id')
      .eq('commerce_id', validated.commerceId)
      .eq('user_id', user.id)
      .single();

    if (existingAvis) {
      return actionResponse(false, null, 'Vous avez déjà donné un avis pour ce commerce');
    }

    // Insérer l'avis
    // @ts-ignore
    const { data: avis, error } = await supabase
      .from('avis')
      .insert({
        commerce_id: validated.commerceId,
        user_id: user.id,
        note: validated.note,
        commentaire: validated.commentaire,
      })
      .select()
      .single();

    if (error) {
      return actionResponse(false, null, error.message);
    }

    // ============================================
    // TODO[IA-TEAM]: Appel à l'Edge Function Supabase "analyze-review"
    // Entrée attendue : { commentaire: string, commerceId: string }
    // Sortie attendue : { sentiment: "positif"|"neutre"|"negatif", score: number, resume?: string, isSpam: boolean }
    // Ne PAS implémenter l'appel ici — laisser ce stub pour l'équipe IA.
    // ============================================
    const analyseIA: AnalyseIAResult | null = null; // placeholder en attendant l'intégration

    // Si l'IA est disponible, mettre à jour l'avis avec les résultats
    if (analyseIA) {
      // @ts-ignore
      await supabase
        .from('avis')
        .update({
          sentiment: (analyseIA as AnalyseIAResult).sentiment,
          is_spam: (analyseIA as AnalyseIAResult).isSpam,
          resume_ia: (analyseIA as AnalyseIAResult).resume,
        })
        .eq('id', (avis as any).id);
    }

    // Recalculer la note moyenne du commerce
    await recalculerNoteCommerce(validated.commerceId);

    revalidatePath(`/commerces/${validated.commerceId}`);
    return actionResponse(true, avis, 'Avis publié avec succès !');
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return actionResponse(false, null, error.errors[0].message);
    }
    return actionResponse(false, null, 'Erreur lors de la création de l\'avis');
  }
}

/**
 * Mettre à jour un avis
 */
export async function updateAvis(avisId: string, formData: FormData) {
  try {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return actionResponse(false, null, 'Vous devez être connecté');
    }

    const rawData = {
      avisId,
      note: formData.get('note') ? parseInt(formData.get('note') as string) : undefined,
      commentaire: formData.get('commentaire'),
    };

    const validated = updateAvisSchema.parse(rawData);

    // Vérifier la propriété
    const { data: avis } = await supabase
      .from('avis')
      .select('user_id, commerce_id')
      .eq('id', validated.avisId)
      .single();

    if (!avis || avis.user_id !== user.id) {
      return actionResponse(false, null, 'Permission denied');
    }

    // Mise à jour
    // @ts-ignore
    const { error } = await supabase
      .from('avis')
      .update({
        note: validated.note,
        commentaire: validated.commentaire,
      })
      .eq('id', validated.avisId);

    if (error) {
      return actionResponse(false, null, error.message);
    }

    // Recalculer la note moyenne
    await recalculerNoteCommerce(avis.commerce_id);

    revalidatePath(`/commerces/${avis.commerce_id}`);
    return actionResponse(true, null, 'Avis mis à jour');
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return actionResponse(false, null, error.errors[0].message);
    }
    return actionResponse(false, null, 'Erreur lors de la mise à jour');
  }
}

/**
 * Supprimer un avis
 */
export async function deleteAvis(avisId: string) {
  try {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return actionResponse(false, null, 'Vous devez être connecté');
    }

    const validated = deleteAvisSchema.parse({ avisId });

    // Vérifier la propriété
    const { data: avis } = await supabase
      .from('avis')
      .select('user_id, commerce_id')
      .eq('id', validated.avisId)
      .single() as any;

    if (!avis || avis.user_id !== user.id) {
      return actionResponse(false, null, 'Permission denied');
    }

    // Suppression
    const { error } = await supabase
      .from('avis')
      .delete()
      .eq('id', validated.avisId);

    if (error) {
      return actionResponse(false, null, error.message);
    }

    // Recalculer la note moyenne
    await recalculerNoteCommerce((avis as any).commerce_id);

    revalidatePath(`/commerces/${(avis as any).commerce_id}`);
    return actionResponse(true, null, 'Avis supprimé');
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return actionResponse(false, null, error.errors[0].message);
    }
    return actionResponse(false, null, 'Erreur lors de la suppression');
  }
}

/**
 * Recalcule la note moyenne d'un commerce
 */
async function recalculerNoteCommerce(commerceId: string) {
  const supabase = createClient();

  const { data: stats } = await supabase
    .from('avis')
    .select('note')
    .eq('commerce_id', commerceId)
    .eq('is_spam', false);

  if (!stats || stats.length === 0) {
    await supabase
      .from('commerces')
      .update({ note_moyenne: 0, nb_avis: 0 })
      .eq('id', commerceId);
    return;
  }

  const noteMoyenne = stats.reduce((sum: number, avis: { note: number }) => sum + avis.note, 0) / stats.length;

  await supabase
    .from('commerces')
    .update({
      note_moyenne: Math.round(noteMoyenne * 100) / 100,
      nb_avis: stats.length,
    })
    .eq('id', commerceId);
}
