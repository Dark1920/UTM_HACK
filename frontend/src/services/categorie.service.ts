import { supabase } from '@/lib/supabase/client';
import type { Categorie } from '@/types/commerce';

export const categorieService = {
  async getAll(): Promise<Categorie[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('nom');
    if (error) throw new Error(error.message);
    return (data || []).map((row) => ({
      id: row.id,
      nom: row.nom,
      slug: row.slug || '',
      icone: row.icone || '',
      description: row.description || undefined,
      nombreCommerces: row.nombre_commerces || 0,
    }));
  },

  async getById(id: string): Promise<Categorie | undefined> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return undefined;
    return {
      id: data.id,
      nom: data.nom,
      slug: data.slug || '',
      icone: data.icone || '',
      description: data.description || undefined,
      nombreCommerces: data.nombre_commerces || 0,
    };
  },
};
