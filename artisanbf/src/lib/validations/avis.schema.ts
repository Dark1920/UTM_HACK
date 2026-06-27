import { z } from 'zod';

// ============================================
// Schémas de validation pour les avis
// ============================================

export const createAvisSchema = z.object({
  commerceId: z.string().uuid('ID de commerce invalide'),
  note: z.number().int().min(1, 'La note doit être entre 1 et 5').max(5),
  commentaire: z.string().max(2000, 'Le commentaire ne peut pas dépasser 2000 caractères').optional(),
});

export const updateAvisSchema = z.object({
  avisId: z.string().uuid('ID d\'avis invalide'),
  note: z.number().int().min(1).max(5).optional(),
  commentaire: z.string().max(2000).optional(),
});

export const deleteAvisSchema = z.object({
  avisId: z.string().uuid('ID d\'avis invalide'),
});

export type CreateAvisInput = z.infer<typeof createAvisSchema>;
export type UpdateAvisInput = z.infer<typeof updateAvisSchema>;
export type DeleteAvisInput = z.infer<typeof deleteAvisSchema>;
