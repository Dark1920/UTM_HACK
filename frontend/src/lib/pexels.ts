import { env } from '@/lib/env';

const PEXELS_SEARCH_URL = 'https://api.pexels.com/v1/search';

interface PexelsPhoto {
  src: { large: string; medium: string };
}

interface PexelsSearchResponse {
  photos: PexelsPhoto[];
}

/**
 * Cherche des photos sur Pexels pour une requête donnée.
 * Renvoie un tableau vide (sans erreur) si la clé API est absente
 * ou si l'appel échoue, pour ne jamais casser l'affichage côté client.
 */
export async function searchPexelsPhotos(query: string, perPage = 4): Promise<string[]> {
  if (!env.PEXELS_API_KEY) return [];

  try {
    const url = `${PEXELS_SEARCH_URL}?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;
    const res = await fetch(url, {
      headers: { Authorization: env.PEXELS_API_KEY },
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!res.ok) return [];

    const data = (await res.json()) as PexelsSearchResponse;
    return data.photos.map((p) => p.src.large);
  } catch {
    return [];
  }
}
