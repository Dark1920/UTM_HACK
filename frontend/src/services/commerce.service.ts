import type { Commerce, CreateCommerceData } from '@/types/commerce';

const API = '/api/commerces';

function mapCommerce(row: Record<string, unknown>): Commerce {
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
    const params = new URLSearchParams();
    if (filters?.categorieId) params.set('categorie', filters.categorieId);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.artisanId) params.set('artisanId', filters.artisanId);

    const qs = params.toString();
    const res = await fetch(`${API}${qs ? '?' + qs : ''}`);
    if (!res.ok) throw new Error('Erreur chargement commerces');
    const data = await res.json();
    return (data.commerces || []).map(mapCommerce);
  },

  async getById(id: string): Promise<Commerce | undefined> {
    const res = await fetch(`${API}/${id}`);
    if (!res.ok) return undefined;
    const data = await res.json();
    return mapCommerce(data);
  },

  async create(data: CreateCommerceData, artisanId: string): Promise<Commerce> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('supabase_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(API, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur création commerce');
    return mapCommerce(await res.json());
  },

  async update(id: string, data: Partial<CreateCommerceData>): Promise<Commerce> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('supabase_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur mise à jour commerce');
    return mapCommerce(await res.json());
  },

  async delete(id: string): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('supabase_token') : null;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API}/${id}`, { method: 'DELETE', headers });
    if (!res.ok) throw new Error('Erreur suppression commerce');
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
