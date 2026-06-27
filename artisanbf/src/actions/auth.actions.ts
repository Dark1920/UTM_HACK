// Server Actions pour l'authentification
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { inscriptionSchema, connexionSchema, resetPasswordSchema } from '@/lib/validations/auth.schema';
import { actionResponse } from '@/lib/utils';
import { checkRateLimit, inscriptionRateLimiter } from '@/lib/ratelimit/upstash';
import type { Role } from '@/types';

/**
 * Inscription d'un nouvel utilisateur
 */
export async function inscription(formData: FormData) {
  try {
    const rawData = {
      email: formData.get('email'),
      password: formData.get('password'),
      nom: formData.get('nom'),
      telephone: formData.get('telephone'),
      role: formData.get('role'),
    };

    // Validation Zod
    const validated = inscriptionSchema.parse(rawData);

    // Rate limiting
    const { success: rateLimitSuccess } = await checkRateLimit(
      inscriptionRateLimiter,
      formData.get('email') as string
    );

    if (!rateLimitSuccess) {
      return actionResponse(false, null, 'Trop de tentatives. Réessayez plus tard.');
    }

    const supabase = createClient();

    // Création de l'utilisateur dans Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        data: {
          nom: validated.nom,
          role: validated.role,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      },
    });

    if (error) {
      return actionResponse(false, null, error.message);
    }

    revalidatePath('/');
    return actionResponse(true, { userId: data.user?.id }, 'Inscription réussie ! Vérifiez votre email.');
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return actionResponse(false, null, error.errors[0].message);
    }
    return actionResponse(false, null, 'Erreur lors de l\'inscription');
  }
}

/**
 * Connexion d'un utilisateur
 */
export async function connexion(formData: FormData) {
  try {
    const rawData = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    // Validation Zod
    const validated = connexionSchema.parse(rawData);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    });

    if (error) {
      return actionResponse(false, null, error.message);
    }

    revalidatePath('/');
    redirect('/dashboard');
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return actionResponse(false, null, error.errors[0].message);
    }
    return actionResponse(false, null, 'Erreur lors de la connexion');
  }
}

/**
 * Déconnexion
 */
export async function deconnexion() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/connexion');
}

/**
 * Demande de réinitialisation de mot de passe
 */
export async function resetPassword(formData: FormData) {
  try {
    const rawData = {
      email: formData.get('email'),
    };

    const validated = resetPasswordSchema.parse(rawData);

    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(validated.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reinitialisation`,
    });

    if (error) {
      return actionResponse(false, null, error.message);
    }

    return actionResponse(true, null, 'Email de réinitialisation envoyé !');
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return actionResponse(false, null, error.errors[0].message);
    }
    return actionResponse(false, null, 'Erreur lors de la demande de réinitialisation');
  }
}

/**
 * Récupère l'utilisateur courant
 */
export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Récupérer le profil utilisateur
  const { data: profil } = await supabase
    .from('utilisateurs')
    .select('*')
    .eq('id', user.id)
    .single();

  return { ...user, profil };
}

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 */
export async function checkRole(requiredRole: Role) {
  const user = await getCurrentUser();
  if (!user || !(user as any).profil) return false;
  return (user as any).profil.role === requiredRole;
}
