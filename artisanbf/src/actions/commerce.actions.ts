// Server Actions pour la gestion des commerces
// @ts-nocheck - Types Supabase seront générés après configuration
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createCommerceSchema, updateCommerceSchema, deleteCommerceSchema } from '@/lib/validations/commerce.schema';
import { actionResponse } from '@/lib/utils';
import { createGeographyPoint } from '@/lib/geo/proximite';

/**
 * Créer un nouveau commerce
 */
export async function createCommerce(formData: FormData) {
  try {
    const supabase = createClient();

    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return actionResponse(false, null, 'Vous devez être connecté');
    }

    const rawData = {
      nom: formData.get('nom'),
      description: formData.get('description'),
      categorie_id: formData.get('categorie_id'),
      telephone: formData.get('telephone'),
      latitude: parseFloat(formData.get('latitude') as string),
      longitude: parseFloat(formData.get('longitude') as string),
      adresse_texte: formData.get('adresse_texte'),
      statut: formData.get('statut'),
    };

    // Validation Zod
    const validated = createCommerceSchema.parse(rawData);

    // Créer le point géographique
    const localisation = createGeographyPoint(validated.latitude, validated.longitude);

    // Insertion en base
    const { data, error } = await supabase
      .from('commerces')
      .insert({
        user_id: user.id,
        nom: validated.nom,
        description: validated.description,
        categorie_id: validated.categorie_id,
        telephone: validated.telephone,
        localisation,
        adresse_texte: validated.adresse_texte,
        statut: validated.statut,
      })
      .select()
      .single();

    if (error) {
      return actionResponse(false, null, error.message);
    }

    revalidatePath('/dashboard/commerces');
    return actionResponse(true, data, 'Commerce créé avec succès !');
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return actionResponse(false, null, error.errors[0].message);
    }
    return actionResponse(false, null, 'Erreur lors de la création du commerce');
  }
}

/**
 * Mettre à jour un commerce
 */
export async function updateCommerce(commerceId: string, formData: FormData) {
  try {
    const supabase = createClient();

    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return actionResponse(false, null, 'Vous devez être connecté');
    }

    // Vérifier que le commerce appartient à l'utilisateur
    const { data: commerce } = await supabase
      .from('commerces')
      .select('user_id')
      .eq('id', commerceId)
      .single();

    if (!commerce || commerce.user_id !== user.id) {
      return actionResponse(false, null, 'Vous n\'avez pas la permission de modifier ce commerce');
    }

    const rawData = {
      nom: formData.get('nom'),
      description: formData.get('description'),
      categorie_id: formData.get('categorie_id'),
      telephone: formData.get('telephone'),
      latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : undefined,
      longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : undefined,
      adresse_texte: formData.get('adresse_texte'),
      statut: formData.get('statut'),
    };

    // Validation Zod
    const validated = updateCommerceSchema.parse(rawData);

    // Préparer les données de mise à jour
    const updateData: any = { ...validated };
    if (validated.latitude && validated.longitude) {
      updateData.localisation = createGeographyPoint(validated.latitude, validated.longitude);
      delete updateData.latitude;
      delete updateData.longitude;
    }

    // Mise à jour
    const { data, error } = await supabase
      .from('commerces')
      .update(updateData)
      .eq('id', commerceId)
      .select()
      .single();

    if (error) {
      return actionResponse(false, null, error.message);
    }

    revalidatePath(`/dashboard/commerces/${commerceId}`);
    return actionResponse(true, data, 'Commerce mis à jour !');
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return actionResponse(false, null, error.errors[0].message);
    }
    return actionResponse(false, null, 'Erreur lors de la mise à jour');
  }
}

/**
 * Supprimer un commerce
 */
export async function deleteCommerce(commerceId: string) {
  try {
    const supabase = createClient();

    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return actionResponse(false, null, 'Vous devez être connecté');
    }

    // Validation
    const validated = deleteCommerceSchema.parse({ commerceId });

    // Vérifier la propriété
    const { data: commerce } = await supabase
      .from('commerces')
      .select('user_id')
      .eq('id', validated.commerceId)
      .single();

    if (!commerce || commerce.user_id !== user.id) {
      return actionResponse(false, null, 'Permission denied');
    }

    // Suppression
    const { error } = await supabase
      .from('commerces')
      .delete()
      .eq('id', validated.commerceId);

    if (error) {
      return actionResponse(false, null, error.message);
    }

    revalidatePath('/dashboard/commerces');
    return actionResponse(true, null, 'Commerce supprimé');
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return actionResponse(false, null, error.errors[0].message);
    }
    return actionResponse(false, null, 'Erreur lors de la suppression');
  }
}

/**
 * Récupérer les commerces d'un utilisateur
 */
export async function getMyCommerces() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('commerces')
    .select('*, categories(nom, icone)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data;
}
