import { z } from 'zod';

// ============================================
// Schémas de validation pour les commerces
// ============================================

export const createCommerceSchema = z.object({
  nom: z.string().min(3, 'Le nom doit contenir au moins 3 caractères').max(255),
  description: z.string().max(2000).optional(),
  categorie_id: z.string().uuid('ID de catégorie invalide').optional(),
  telephone: z.string().max(20).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  adresse_texte: z.string().max(500).optional(),
  statut: z.enum(['brouillon', 'publie']).default('brouillon'),
});

export const updateCommerceSchema = z.object({
  nom: z.string().min(3).max(255).optional(),
  description: z.string().max(2000).optional(),
  categorie_id: z.string().uuid().optional(),
  telephone: z.string().max(20).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  adresse_texte: z.string().max(500).optional(),
  statut: z.enum(['brouillon', 'publie', 'depublie']).optional(),
});

export const deleteCommerceSchema = z.object({
  commerceId: z.string().uuid('ID de commerce invalide'),
});

export type CreateCommerceInput = z.infer<typeof createCommerceSchema>;
export type UpdateCommerceInput = z.infer<typeof updateCommerceSchema>;
export type DeleteCommerceInput = z.infer<typeof deleteCommerceSchema>;
