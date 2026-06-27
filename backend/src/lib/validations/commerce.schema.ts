import { z } from 'zod';

// ============================================
// Schémas de validation pour les commerces
// ============================================

export const createCommerceSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(255),
  description: z.string().max(2000).optional(),
  categorie_id: z.string().uuid('Catégorie invalide').optional(),
  telephone: z.string().max(20).optional(),
  email: z.string().email('Email invalide').optional(),
  site_web: z.string().url('URL invalide').optional(),
  adresse: z.string().optional(),
  ville: z.string().max(100).optional(),
  code_postal: z.string().max(20).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  horaires: z.any().optional(),
  photo_principale: z.string().url('URL de photo invalide').optional(),
});

export const updateCommerceSchema = createCommerceSchema.partial();

export const deleteCommerceSchema = z.object({
  id: z.string().uuid('ID de commerce invalide'),
});

export type CreateCommerceInput = z.infer<typeof createCommerceSchema>;
export type UpdateCommerceInput = z.infer<typeof updateCommerceSchema>;
export type DeleteCommerceInput = z.infer<typeof deleteCommerceSchema>;
