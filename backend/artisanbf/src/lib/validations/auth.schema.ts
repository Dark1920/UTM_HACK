import { z } from 'zod';

// ============================================
// Schémas de validation pour l'authentification
// ============================================

export const inscriptionSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un numéro'),
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(255),
  telephone: z.string().optional(),
  role: z.enum(['citoyen', 'artisan']).default('citoyen'),
});

export const connexionSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

export const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un numéro'),
});

export type InscriptionInput = z.infer<typeof inscriptionSchema>;
export type ConnexionInput = z.infer<typeof connexionSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
