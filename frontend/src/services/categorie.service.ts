import type { Categorie } from '@/types/commerce';
import { apiFetch } from '@/lib/api-client';

const API = '/api/categories';

function mapCategorie(row: Record<string, unknown>): Categorie {
  return {
    id: row.id as string,
    nom: row.nom as string,
    slug: (row.slug as string) || '',
    icone: (row.icone as string) || '',
    description: (row.description as string) || undefined,
    nombreCommerces: (row.nombre_commerces as number) || 0,
  };
}

export const categorieService = {
  async getAll(): Promise<Categorie[]> {
    const data = await apiFetch<unknown>(API);
    return (Array.isArray(data) ? data : []).map(mapCategorie);
  },

  async getById(id: string): Promise<Categorie | undefined> {
    const all = await this.getAll();
    return all.find((c) => c.id === id);
  },
};
