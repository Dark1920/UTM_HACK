import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court'),
});

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court'),
  nom: z.string().min(2, 'Nom trop court'),
  prenom: z.string().min(2, 'Prénom trop court'),
  telephone: z.string().optional(),
  role: z.enum(['citoyen', 'artisan']),
});

export const commerceSchema = z.object({
  nom: z.string().min(2, 'Nom trop court'),
  description: z.string().min(10, 'Description trop courte'),
  categorieId: z.string().min(1, 'Catégorie requise'),
  adresse: z.string().min(5, 'Adresse trop courte'),
  ville: z.string().min(2, 'Ville requise'),
  telephone: z.string().min(8, 'Numéro invalide'),
  whatsapp: z.string().optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
});

export const commentaireSchema = z.object({
  texte: z.string().min(3, 'Commentaire trop court').max(1000, 'Commentaire trop long'),
  note: z.number().min(1).max(5),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CommerceInput = z.infer<typeof commerceSchema>;
export type CommentaireInput = z.infer<typeof commentaireSchema>;
