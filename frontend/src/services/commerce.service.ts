import type { Commerce, CreateCommerceData } from '@/types/commerce';
import { apiFetch } from '@/lib/api-client';

const API = '/api/commerces';

export function mapCommerce(row: Record<string, unknown>): Commerce {
  const categories = row.categories as Record<string, unknown> | null;
  const artisans = row.utilisateurs as Record<string, unknown> | null;
  return {
    id: row.id as string,
    nom: row.nom as string,
    description: row.description as string,
    categorieId: row.categorie_id as string,
    categorie: categories ? {
      id: categories.id as string,
      nom: categories.nom as string,
      slug: (categories.slug as string) || '',
      icone: (categories.icone as string) || '',
      description: categories.description as string | undefined,
      nombreCommerces: (categories.nombre_commerces as number) || 0,
    } : undefined,
    artisanId: row.artisan_id as string,
    artisan: artisans ? {
      id: artisans.id as string,
      nom: (artisans.nom as string) || '',
      prenom: (artisans.prenom as string) || '',
      email: (artisans.email as string) || '',
      role: 'artisan' as const,
      estActif: true,
      dateCreation: '',
    } : undefined,
    adresse: row.adresse as string,
    ville: row.ville as string,
    latitude: row.latitude as number,
    longitude: row.longitude as number,
    telephone: row.telephone as string,
    whatsapp: (row.whatsapp as string) || undefined,
    email: (row.email as string) || undefined,
    photos: (row.photos as string[]) || [],
    note: (row.note_moyenne as number) || 0,
    nombreAvis: (row.nombre_avis as number) || 0,
    nombreVues: (row.nombre_vues as number) || 0,
    nombreAppels: (row.nombre_appels as number) || 0,
    nombreClicsWhatsApp: (row.nombre_clics_whatsapp as number) || 0,
    estPublic: row.est_public as boolean,
    dateCreation: row.created_at as string,
    dateModification: row.updated_at as string,
  };
}

export interface CommerceFilters {
  categorieId?: string;
  ville?: string;
  search?: string;
  artisanId?: string;
}

export const commerceService = {
  async getAll(filters?: CommerceFilters): Promise<Commerce[]> {
    const data = await apiFetch<{ commerces?: Record<string, unknown>[] }>(API, {
      query: {
        categorie: filters?.categorieId,
        search: filters?.search,
        artisanId: filters?.artisanId,
      },
    });
    return (data.commerces || []).map(mapCommerce);
  },

  async getById(id: string): Promise<Commerce | undefined> {
    try {
      const data = await apiFetch<Record<string, unknown>>(`${API}/${id}`);
      return mapCommerce(data);
    } catch {
      return undefined;
    }
  },

  async create(data: CreateCommerceData, artisanId: string): Promise<Commerce> {
    const row = await apiFetch<Record<string, unknown>>(API, {
      method: 'POST',
      auth: true,
      body: data,
    });
    return mapCommerce(row);
  },

  async update(id: string, data: Partial<CreateCommerceData>): Promise<Commerce> {
    const row = await apiFetch<Record<string, unknown>>(`${API}/${id}`, {
      method: 'PUT',
      auth: true,
      body: data,
    });
    return mapCommerce(row);
  },

  async delete(id: string): Promise<void> {
    await apiFetch<void>(`${API}/${id}`, { method: 'DELETE', auth: true });
  },

  async incrementView(id: string): Promise<void> {
    // TODO: backend route for stats
  },

  async incrementCall(id: string): Promise<void> {
    // TODO: backend route for stats
  },

  async incrementWhatsAppClick(id: string): Promise<void> {
    // TODO: backend route for stats
  },
};
