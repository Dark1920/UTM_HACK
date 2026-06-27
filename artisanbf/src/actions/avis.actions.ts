// Server Actions pour la gestion des avis avec analyse IA automatique
// @ts-nocheck
'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

// Schéma de validation pour la création d'avis
const avisSchema = z.object({
  commerceId: z.string().uuid('ID de commerce invalide'),
  note: z.number().int().min(1).max(5, 'La note doit être entre 1 et 5'),
  commentaire: z.string().min(2, 'Le commentaire doit contenir au moins 2 caractères').max(1000),
})

/**
 * Crée un nouvel avis avec analyse IA automatique
 * 
 * @param formData - Données du formulaire
 * @returns Résultat de l'opération
 */
export async function createAvis(formData: FormData) {
  const supabase = createClient()
  
  // 1. Récupérer l'utilisateur connecté
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return {
      success: false,
      error: 'Vous devez être connecté pour déposer un avis',
    }
  }

  // 2. Valider les données
  const rawData = {
    commerceId: formData.get('commerceId'),
    note: Number(formData.get('note')),
    commentaire: formData.get('commentaire'),
  }

  const validated = avisSchema.safeParse(rawData)
  
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.errors[0].message,
    }
  }

  const { commerceId, note, commentaire } = validated.data

  // 3. Vérifier si l'utilisateur a déjà donné un avis pour ce commerce
  const { data: existingAvis } = await supabase
    .from('avis')
    .select('id')
    .eq('user_id', user.id)
    .eq('commerce_id', commerceId)
    .single()

  if (existingAvis) {
    return {
      success: false,
      error: 'Vous avez déjà déposé un avis pour ce commerce',
    }
  }

  // 4. Appeler l'API AI pour analyser le commentaire (en arrière-plan)
  const analyseIA = await analyseCommentaireAvecIA(commentaire)

  // 5. Insérer l'avis dans la base de données
  const { data: avis, error } = await supabase
    .from('avis')
    .insert({
      user_id: user.id,
      commerce_id: commerceId,
      note,
      commentaire,
      sentiment: analyseIA?.sentiment || 'neutre',
      score_sentiment: analyseIA?.score || 0,
      is_spam: analyseIA?.isSpam || false,
    })
    .select()
    .single()

  if (error) {
    console.error('Erreur lors de la création de l avis:', error)
    return {
      success: false,
      error: 'Erreur lors de la création de l avis',
    }
  }

  // 6. Mettre à jour la note moyenne du commerce
  await updateNoteMoyenneCommerce(supabase, commerceId)

  // 7. Revalider le cache
  revalidatePath(`/commerces/${commerceId}`)

  return {
    success: true,
    data: avis,
    message: 'Avis créé avec succès !',
  }
}

/**
 * Analyse un commentaire avec l'IA (Llama via Groq)
 * 
 * @param commentaire - Le commentaire à analyser
 * @returns Résultat de l'analyse IA
 */
async function analyseCommentaireAvecIA(commentaire: string) {
  try {
    // Appel à l'API AI locale
    const apiUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const response = await fetch(`${apiUrl}/api/ai/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commentaire }),
    })

    if (!response.ok) {
      console.warn('Analyse IA échouée, utilisation des valeurs par défaut')
      return null
    }

    const data = await response.json()
    
    // Transformer le résultat de l'analyse
    return {
      sentiment: data.sentiment || 'neutre',
      score: data.note ? data.note / 5 : 0,
      isSpam: !data.pertinent,
      pointsForts: data.points_forts || [],
      pointsFaibles: data.points_faibles || [],
    }
  } catch (error) {
    console.error('Erreur lors de l analyse IA:', error)
    // En cas d'erreur, on retourne null et l'avis sera créé sans analyse
    return null
  }
}

/**
 * Met à jour la note moyenne d'un commerce après un nouvel avis
 */
async function updateNoteMoyenneCommerce(supabase: any, commerceId: string) {
  try {
    // Récupérer tous les avis pour ce commerce
    const { data: avis } = await supabase
      .from('avis')
      .select('note')
      .eq('commerce_id', commerceId)

    if (avis && avis.length > 0) {
      const noteMoyenne = avis.reduce((sum: number, avis: any) => sum + avis.note, 0) / avis.length
      const nombreAvis = avis.length

      await supabase
        .from('commerces')
        .update({
          note_moyenne: Math.round(noteMoyenne * 100) / 100,
          nombre_avis: nombreAvis,
        })
        .eq('id', commerceId)
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la note moyenne:', error)
  }
}

/**
 * Récupère tous les avis pour un commerce
 */
export async function getAvisByCommerce(commerceId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('avis')
    .select(`
      *,
      utilisateurs (
        nom,
        photo_url
      )
    `)
    .eq('commerce_id', commerceId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur lors de la récupération des avis:', error)
    return []
  }

  return data || []
}

/**
 * Supprime un avis (seulement par l'auteur ou un admin)
 */
export async function deleteAvis(avisId: string) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return {
      success: false,
      error: 'Vous devez être connecté',
    }
  }

  // Vérifier si l'utilisateur est l'auteur ou admin
  const { data: avis } = await supabase
    .from('avis')
    .select('user_id, commerce_id')
    .eq('id', avisId)
    .single()

  if (!avis) {
    return {
      success: false,
      error: 'Avis non trouvé',
    }
  }

  const { data: utilisateur } = await supabase
    .from('utilisateurs')
    .select('role')
    .eq('id', user.id)
    .single()

  const isAdmin = utilisateur?.role === 'admin'
  const isAuthor = avis.user_id === user.id

  if (!isAuthor && !isAdmin) {
    return {
      success: false,
      error: 'Vous n êtes pas autorisé à supprimer cet avis',
    }
  }

  const { error } = await supabase
    .from('avis')
    .delete()
    .eq('id', avisId)

  if (error) {
    console.error('Erreur lors de la suppression de l avis:', error)
    return {
      success: false,
      error: 'Erreur lors de la suppression',
    }
  }

  // Mettre à jour la note moyenne
  await updateNoteMoyenneCommerce(supabase, avis.commerce_id)
  
  revalidatePath(`/commerces/${avis.commerce_id}`)

  return {
    success: true,
    message: 'Avis supprimé avec succès',
  }
}
