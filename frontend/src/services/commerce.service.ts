import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/api';
import { mapCommerceFromAPI, mapCommerceToAPI } from '@/lib/mappers';
import type { Commerce, CreateCommerceData } from '@/types/commerce';

export interface CommerceFilters {
  categorieId?: string;
  ville?: string;
  search?: string;
  artisanId?: string;
}

export const commerceService = {
  /**
   * Récupérer tous les commerces (avec filtres optionnels)
   */
  async getAll(filters?: CommerceFilters): Promise<Commerce[]> {
    const params: Record<string, string> = {};
    
    if (filters?.categorieId) params.categorieId = filters.categorieId;
    if (filters?.ville) params.ville = filters.ville;
    if (filters?.search) params.search = filters.search;
    if (filters?.artisanId) params.artisanId = filters.artisanId;

    const response = await apiClient.get<{ commerces: Record<string, unknown>[] }>(
      API_ENDPOINTS.COMMERCES.LIST,
      { params }
    );
    
    return (response.commerces || []).map(mapCommerceFromAPI);
  },

  /**
   * Récupérer un commerce par son ID
   */
  async getById(id: string): Promise<Commerce> {
    const raw = await apiClient.get<Record<string, unknown>>(
      API_ENDPOINTS.COMMERCES.DETAIL(id)
    );
    return mapCommerceFromAPI(raw);
  },

  /**
   * Créer un nouveau commerce
   */
  async create(data: CreateCommerceData): Promise<Commerce> {
    const raw = await apiClient.post<Record<string, unknown>>(
      API_ENDPOINTS.COMMERCES.CREATE,
      mapCommerceToAPI(data)
    );
    return mapCommerceFromAPI(raw);
  },

  /**
   * Mettre à jour un commerce
   */
  async update(id: string, data: Partial<CreateCommerceData>): Promise<Commerce> {
    const raw = await apiClient.put<Record<string, unknown>>(
      API_ENDPOINTS.COMMERCES.UPDATE(id),
      mapCommerceToAPI(data as CreateCommerceData)
    );
    return mapCommerceFromAPI(raw);
  },

  /**
   * Supprimer un commerce
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.COMMERCES.DELETE(id)
    );
  },
};
