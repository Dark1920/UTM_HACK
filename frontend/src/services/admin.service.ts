import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/api';
import { mapCommerceFromAPI, mapAvisFromAPI, mapUtilisateurFromAPI } from '@/lib/mappers';
import type { Commerce } from '@/types/commerce';
import type { Commentaire } from '@/types/commentaire';
import type { Utilisateur } from '@/types/utilisateur';

export interface AdminStats {
  totalUtilisateurs: number;
  totalCommerces: number;
  totalCommentaires: number;
  totalVues: number;
  utilisateursActifs: number;
  commercesEnAttente: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
}

export const adminService = {
  // ─── Statistiques ──────────────────────────────────────────────────────────
  async getStats(): Promise<AdminStats> {
    const raw = await apiClient.get<Record<string, unknown>>(
      API_ENDPOINTS.ADMIN.STATISTIQUES
    );
    return {
      totalUtilisateurs: (raw.total_utilisateurs as number) || 0,
      totalCommerces: (raw.total_commerces as number) || 0,
      totalCommentaires: (raw.total_avis as number) || 0,
      totalVues: 0,
      utilisateursActifs: 0,
      commercesEnAttente: (raw.commerces_en_attente as number) || 0,
    };
  },

  // ─── Utilisateurs ──────────────────────────────────────────────────────────
  async getUsers(params?: { page?: number; limit?: number; role?: string; search?: string }): Promise<{ utilisateurs: Utilisateur[]; total: number }> {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = String(params.page);
    if (params?.limit) queryParams.limit = String(params.limit);
    if (params?.role) queryParams.role = params.role;
    if (params?.search) queryParams.search = params.search;

    const raw = await apiClient.get<{ utilisateurs: Record<string, unknown>[]; total: number }>(
      API_ENDPOINTS.ADMIN.UTILISATEURS.LIST,
      { params: queryParams }
    );
    return {
      utilisateurs: (raw.utilisateurs || []).map(mapUtilisateurFromAPI),
      total: raw.total || 0,
    };
  },

  async updateUserRole(userId: string, role: 'citoyen' | 'artisan' | 'admin'): Promise<void> {
    await apiClient.put(
      API_ENDPOINTS.ADMIN.UTILISATEURS.DETAIL(userId),
      { role }
    );
  },

  async deactivateUser(userId: string): Promise<void> {
    await apiClient.delete(
      API_ENDPOINTS.ADMIN.UTILISATEURS.DETAIL(userId)
    );
  },

  // ─── Commerces ─────────────────────────────────────────────────────────────
  async getCommerces(params?: { page?: number; limit?: number; statut?: string; categorie_id?: string; search?: string }): Promise<{ commerces: Commerce[]; total: number }> {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = String(params.page);
    if (params?.limit) queryParams.limit = String(params.limit);
    if (params?.statut) queryParams.statut = params.statut;
    if (params?.categorie_id) queryParams.categorie_id = params.categorie_id;
    if (params?.search) queryParams.search = params.search;

    const raw = await apiClient.get<{ commerces: Record<string, unknown>[]; total: number }>(
      API_ENDPOINTS.ADMIN.COMMERCES.LIST,
      { params: queryParams }
    );
    return {
      commerces: (raw.commerces || []).map(mapCommerceFromAPI),
      total: raw.total || 0,
    };
  },

  async updateCommerceStatut(commerceId: string, statut: string, raison?: string): Promise<void> {
    await apiClient.put(
      API_ENDPOINTS.ADMIN.COMMERCES.STATUT(commerceId),
      { statut, raison }
    );
  },

  async deleteCommerce(commerceId: string): Promise<void> {
    await apiClient.delete(
      API_ENDPOINTS.ADMIN.COMMERCES.DETAIL(commerceId)
    );
  },

  // ─── Avis ──────────────────────────────────────────────────────────────────
  async getAvis(params?: { page?: number; limit?: number; is_spam?: boolean; sentiment?: string; commerce_id?: string }): Promise<{ avis: Commentaire[]; total: number }> {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = String(params.page);
    if (params?.limit) queryParams.limit = String(params.limit);
    if (params?.is_spam !== undefined) queryParams.is_spam = String(params.is_spam);
    if (params?.sentiment) queryParams.sentiment = params.sentiment;
    if (params?.commerce_id) queryParams.commerce_id = params.commerce_id;

    const raw = await apiClient.get<{ avis: Record<string, unknown>[]; total: number }>(
      API_ENDPOINTS.ADMIN.AVIS.LIST,
      { params: queryParams }
    );
    return {
      avis: (raw.avis || []).map(mapAvisFromAPI),
      total: raw.total || 0,
    };
  },

  async deleteAvis(avisId: string): Promise<void> {
    await apiClient.delete(
      API_ENDPOINTS.ADMIN.AVIS.DETAIL(avisId)
    );
  },

  // ─── Catégories ────────────────────────────────────────────────────────────
  async getCategories(): Promise<{ categories: Record<string, unknown>[] }> {
    return apiClient.get(API_ENDPOINTS.ADMIN.CATEGORIES.LIST);
  },

  async createCategory(data: { nom: string; slug: string; icone: string; couleur?: string; description?: string }): Promise<void> {
    await apiClient.post(
      API_ENDPOINTS.ADMIN.CATEGORIES.LIST,
      data
    );
  },

  async updateCategory(categoryId: string, data: { nom?: string; slug?: string; icone?: string; couleur?: string; description?: string }): Promise<void> {
    await apiClient.put(
      API_ENDPOINTS.ADMIN.CATEGORIES.DETAIL(categoryId),
      data
    );
  },

  async deleteCategory(categoryId: string): Promise<void> {
    await apiClient.delete(
      API_ENDPOINTS.ADMIN.CATEGORIES.DETAIL(categoryId)
    );
  },

  // ─── Signalements ──────────────────────────────────────────────────────────
  async getSignalements(params?: { page?: number; limit?: number; statut?: string; type_cible?: string }): Promise<{ signalements: Record<string, unknown>[]; total: number }> {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = String(params.page);
    if (params?.limit) queryParams.limit = String(params.limit);
    if (params?.statut) queryParams.statut = params.statut;
    if (params?.type_cible) queryParams.type_cible = params.type_cible;

    return apiClient.get(
      API_ENDPOINTS.ADMIN.SIGNALEMENTS.LIST,
      { params: queryParams }
    );
  },

  async updateSignalement(signalementId: string, data: { statut: 'traite' | 'ignore'; note_moderateur?: string }): Promise<void> {
    await apiClient.put(
      API_ENDPOINTS.ADMIN.SIGNALEMENTS.DETAIL(signalementId),
      data
    );
  },
};
