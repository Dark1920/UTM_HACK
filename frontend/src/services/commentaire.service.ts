import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/api';
import { mapAvisFromAPI, mapAvisToAPI } from '@/lib/mappers';
import type { Commentaire } from '@/types/commentaire';

export const commentaireService = {
  /**
   * Récupérer les avis d'un commerce
   */
  async getByCommerceId(commerceId: string): Promise<Commentaire[]> {
    const response = await apiClient.get<{ avis: Record<string, unknown>[] }>(
      API_ENDPOINTS.AVIS.LIST(commerceId)
    );
    return (response.avis || []).map(mapAvisFromAPI);
  },

  /**
   * Créer un nouvel avis (avec analyse IA automatique)
   */
  async create(data: {
    texte: string;
    note: number;
    auteurId: string;
    commerceId: string;
  }): Promise<Commentaire> {
    const raw = await apiClient.post<Record<string, unknown>>(
      API_ENDPOINTS.AVIS.CREATE,
      mapAvisToAPI(data)
    );
    return mapAvisFromAPI(raw.avis as Record<string, unknown> ?? raw);
  },

  /**
   * Supprimer un avis
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.AVIS.DELETE(id)
    );
  },

  /**
   * Récupérer tous les avis (admin)
   */
  async getAll(): Promise<Commentaire[]> {
    // Nécessite un endpoint admin - à implémenter si besoin
    return [];
  },
};
