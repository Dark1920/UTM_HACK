import type { Commerce } from '@/types/commerce';
import { mapCommerce } from './commerce.service';
import { apiFetch } from '@/lib/api-client';

const API = '/api/recherche';

export interface RechercheParams {
  q?: string;
  categorieId?: string;
  latitude?: number;
  longitude?: number;
  /** Rayon de recherche en mètres (défaut backend : 5000). */
  rayon?: number;
}

/** Commerce enrichi de la distance (en km) quand la recherche est géolocalisée. */
export type CommerceProche = Commerce & { distance?: number };

export const rechercheService = {
  /**
   * Recherche serveur via /api/recherche.
   * Si latitude/longitude sont fournis, le backend filtre par rayon et trie par distance.
   */
  async rechercher(params: RechercheParams): Promise<CommerceProche[]> {
    const data = await apiFetch<{ commerces?: Record<string, unknown>[] }>(API, {
      query: {
        q: params.q,
        categorie: params.categorieId,
        latitude: params.latitude,
        longitude: params.longitude,
        rayon: params.rayon,
      },
    });

    return (data.commerces || []).map((row: Record<string, unknown>) => {
      const commerce = mapCommerce(row) as CommerceProche;
      // Le backend renvoie la distance en mètres ; on l'expose en km côté UI.
      if (typeof row.distance === 'number') {
        commerce.distance = row.distance / 1000;
      }
      return commerce;
    });
  },
};
