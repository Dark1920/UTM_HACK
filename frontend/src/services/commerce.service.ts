import { supabase } from '@/lib/supabase/client';
import type { Commerce, CreateCommerceData } from '@/types/commerce';

export interface CommerceFilters {
  categorieId?: string;
  ville?: string;
  search?: string;
  artisanId?: string;
}

function rowToCommerce(row: Record<string, unknown>): Commerce {
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
      email: (artisans.email as string) || '',
      nom: (artisans.nom as string) || '',
      prenom: (artisans.prenom as string) || '',
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

export const commerceService = {
  async getAll(filters?: CommerceFilters): Promise<Commerce[]> {
    let query = supabase
      .from('commerces')
      .select('*, categories(*), utilisateurs(id, nom)')
      .eq('est_public', true);

    if (filters?.categorieId) {
      query = query.eq('categorie_id', filters.categorieId);
    }
    if (filters?.ville) {
      query = query.ilike('ville', filters.ville);
    }
    if (filters?.artisanId) {
      query = query.eq('artisan_id', filters.artisanId);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      query = query.or(`nom.ilike.%${s}%,description.ilike.%${s}%,adresse.ilike.%${s}%`);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data || []).map(rowToCommerce);
  },

  async getById(id: string): Promise<Commerce | undefined> {
    const { data, error } = await supabase
      .from('commerces')
      .select('*, categories(*), utilisateurs(id, nom)')
      .eq('id', id)
      .single();
    if (error || !data) return undefined;
    return rowToCommerce(data);
  },

  async create(data: CreateCommerceData, artisanId: string): Promise<Commerce> {
    const { data: row, error } = await supabase
      .from('commerces')
      .insert({
        nom: data.nom,
        description: data.description,
        categorie_id: data.categorieId,
        adresse: data.adresse,
        ville: data.ville,
        latitude: data.latitude,
        longitude: data.longitude,
        telephone: data.telephone,
        whatsapp: data.whatsapp,
        email: data.email,
        artisan_id: artisanId,
        est_public: true,
      })
      .select('*, categories(*), utilisateurs(id, nom)')
      .single();
    if (error) throw new Error(error.message);
    return rowToCommerce(row);
  },

  async update(id: string, data: Partial<CreateCommerceData>): Promise<Commerce> {
    const updateData: Record<string, unknown> = {};
    if (data.nom !== undefined) updateData.nom = data.nom;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.categorieId !== undefined) updateData.categorie_id = data.categorieId;
    if (data.adresse !== undefined) updateData.adresse = data.adresse;
    if (data.ville !== undefined) updateData.ville = data.ville;
    if (data.latitude !== undefined) updateData.latitude = data.latitude;
    if (data.longitude !== undefined) updateData.longitude = data.longitude;
    if (data.telephone !== undefined) updateData.telephone = data.telephone;
    if (data.whatsapp !== undefined) updateData.whatsapp = data.whatsapp;
    if (data.email !== undefined) updateData.email = data.email;

    const { data: row, error } = await supabase
      .from('commerces')
      .update(updateData)
      .eq('id', id)
      .select('*, categories(*), utilisateurs(id, nom)')
      .single();
    if (error) throw new Error(error.message);
    return rowToCommerce(row);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('commerces').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  async incrementView(id: string): Promise<void> {
    await supabase.rpc('increment_commerce_views', { commerce_id: id });
  },

  async incrementCall(id: string): Promise<void> {
    await supabase.rpc('increment_commerce_calls', { commerce_id: id });
  },

  async incrementWhatsAppClick(id: string): Promise<void> {
    await supabase.rpc('increment_commerce_whatsapp', { commerce_id: id });
  },
};
