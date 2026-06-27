// Server Actions pour la gestion du profil utilisateur
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { actionResponse } from '@/lib/utils';
import { z } from 'zod';

const profilSchema = z.object({
  nom: z.string().min(2).max(255).optional(),
  telephone: z.string().max(20).optional(),
});

/**
 * Mettre à jour le profil utilisateur
 */
export async function updateProfil(formData: FormData) {
  try {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return actionResponse(false, null, 'Vous devez être connecté');
    }

    const rawData = {
      nom: formData.get('nom'),
      telephone: formData.get('telephone'),
    };

    const validated = profilSchema.parse(rawData);

    const { error } = await supabase
      .from('utilisateurs')
      // @ts-ignore - Types Supabase seront générés après configuration
      .update(validated)
      .eq('id', user.id);

    if (error) {
      return actionResponse(false, null, error.message);
    }

    revalidatePath('/dashboard/profil');
    return actionResponse(true, null, 'Profil mis à jour !');
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return actionResponse(false, null, error.errors[0].message);
    }
    return actionResponse(false, null, 'Erreur lors de la mise à jour');
  }
}

/**
 * Récupérer le profil utilisateur
 */
export async function getProfil() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('utilisateurs')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) return null;
  return data;
}
