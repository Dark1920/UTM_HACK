import type { Commerce } from '@/types/commerce';
import { mapCommerce } from './commerce.service';

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
    const qs = new URLSearchParams();
    if (params.q) qs.set('q', params.q);
    if (params.categorieId) qs.set('categorie', params.categorieId);
    if (params.latitude != null) qs.set('latitude', String(params.latitude));
    if (params.longitude != null) qs.set('longitude', String(params.longitude));
    if (params.rayon != null) qs.set('rayon', String(params.rayon));

    const res = await fetch(`${API}?${qs.toString()}`);
    if (!res.ok) throw new Error('Erreur recherche');
    const data = await res.json();

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
