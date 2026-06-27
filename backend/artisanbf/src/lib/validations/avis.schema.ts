import { z } from 'zod';

// ============================================
// Schémas de validation pour les avis
// ============================================

export const createAvisSchema = z.object({
  commerceId: z.string().uuid('ID de commerce invalide'),
  note: z.number().int().min(1).max(5, 'La note doit être entre 1 et 5'),
  commentaire: z.string().min(2, 'Le commentaire doit contenir au moins 2 caractères').max(1000),
});

export const updateAvisSchema = z.object({
  id: z.string().uuid('ID d avis invalide'),
  note: z.number().int().min(1).max(5).optional(),
  commentaire: z.string().max(1000).optional(),
});

export const deleteAvisSchema = z.object({
  id: z.string().uuid('ID d avis invalide'),
});

export type CreateAvisInput = z.infer<typeof createAvisSchema>;
export type UpdateAvisInput = z.infer<typeof updateAvisSchema>;
export type DeleteAvisInput = z.infer<typeof deleteAvisSchema>;
