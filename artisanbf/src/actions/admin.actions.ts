// Server Actions pour l'administration
// @ts-nocheck - Types Supabase seront générés après configuration
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { actionResponse } from '@/lib/utils';
import { z } from 'zod';

/**
 * Vérifier si l'utilisateur est admin
 */
async function checkAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;

  const { data: profil } = await supabase
    .from('utilisateurs')
    .select('role')
    .eq('id', user.id)
    .single();

  return (profil as any)?.role === 'admin';
}

/**
 Changer le rôle d'un utilisateur
 */
export async function updateUserRole(userId: string, newRole: 'citoyen' | 'artisan' | 'admin') {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return actionResponse(false, null, 'Permission denied');
    }

    const supabase = createClient();

    // @ts-ignore
    const { error } = await supabase
      .from('utilisateurs')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      return actionResponse(false, null, error.message);
    }

    revalidatePath('/admin/utilisateurs');
    return actionResponse(true, null, 'Rôle mis à jour');
  } catch (error: any) {
    return actionResponse(false, null, 'Erreur lors de la mise à jour');
  }
}

/**
 * Modérer un signalement
 */
export async function modererSignalement(signalementId: string, statut: 'resolu' | 'rejete') {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return actionResponse(false, null, 'Permission denied');
    }

    const supabase = createClient();

    // @ts-ignore
    const { error } = await supabase
      .from('signalements')
      .update({ statut })
      .eq('id', signalementId);

    if (error) {
      return actionResponse(false, null, error.message);
    }

    revalidatePath('/admin/signalements');
    return actionResponse(true, null, 'Signalement modéré');
  } catch (error: any) {
    return actionResponse(false, null, 'Erreur lors de la modération');
  }
}

/**
 * Supprimer un commerce (admin)
 */
export async function adminDeleteCommerce(commerceId: string) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return actionResponse(false, null, 'Permission denied');
    }

    const supabase = createClient();

    const { error } = await supabase
      .from('commerces')
      .delete()
      .eq('id', commerceId);

    if (error) {
      return actionResponse(false, null, error.message);
    }

    revalidatePath('/admin/commerces');
    return actionResponse(true, null, 'Commerce supprimé');
  } catch (error: any) {
    return actionResponse(false, null, 'Erreur lors de la suppression');
  }
}

/**
 * Marquer un avis comme spam (admin)
 */
export async function markAsSpam(avisId: string) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return actionResponse(false, null, 'Permission denied');
    }

    const supabase = createClient();

    // Récupérer le commerce_id pour recalculer la note
    const { data: avis } = await supabase
      .from('avis')
      .select('commerce_id')
      .eq('id', avisId)
      .single();

    // @ts-ignore
    const { error } = await supabase
      .from('avis')
      .update({ is_spam: true })
      .eq('id', avisId);

    if (error) {
      return actionResponse(false, null, error.message);
    }

    // TODO: Recalculer la note moyenne du commerce

    revalidatePath('/admin/avis');
    return actionResponse(true, null, 'Avis marqué comme spam');
  } catch (error: any) {
    return actionResponse(false, null, 'Erreur');
  }
}

/**
 * Récupérer tous les signalements
 */
export async function getAllSignalements() {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return [];

  const supabase = createClient();

  const { data, error } = await supabase
    .from('signalements')
    .select('*, utilisateurs(nom)')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data;
}
