import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/api';

export interface Categorie {
  id: string;
  nom: string;
  slug: string;
  description?: string;
  icone?: string;
  couleur?: string;
}

export const categoryService = {
  async getAll(): Promise<Categorie[]> {
    const response = await apiClient.get<{ categories: Categorie[] }>(
      API_ENDPOINTS.CATEGORIES.LIST
    );
    return response.categories || [];
  },

  async search(query: string): Promise<Categorie[]> {
    const response = await apiClient.get<{ categories: Categorie[] }>(
      API_ENDPOINTS.CATEGORIES.SEARCH(query)
    );
    return response.categories || [];
  },
};
