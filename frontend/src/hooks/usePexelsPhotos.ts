'use client';

import { useEffect, useState } from 'react';

const cache = new Map<string, string[]>();
const pending = new Map<string, Promise<string[]>>();

async function fetchPhotos(query: string, count: number): Promise<string[]> {
  const key = `${query}::${count}`;
  if (cache.has(key)) return cache.get(key)!;
  if (pending.has(key)) return pending.get(key)!;

  const promise = fetch(`/api/photos?query=${encodeURIComponent(query)}&count=${count}`)
    .then((res) => (res.ok ? res.json() : { photos: [] }))
    .then((data: { photos: string[] }) => {
      cache.set(key, data.photos);
      pending.delete(key);
      return data.photos;
    })
    .catch(() => {
      pending.delete(key);
      return [];
    });

  pending.set(key, promise);
  return promise;
}

/**
 * Récupère des photos Pexels pour une requête, avec cache mémoire partagé
 * entre toutes les cartes affichant la même catégorie sur une page.
 * Renvoie un tableau vide tant qu'aucune clé Pexels n'est configurée.
 */
export function usePexelsPhotos(query: string | null, count = 4) {
  const [photos, setPhotos] = useState<string[]>(() => (query ? cache.get(`${query}::${count}`) ?? [] : []));
  const [loading, setLoading] = useState(!!query && !cache.has(`${query}::${count}`));

  useEffect(() => {
    if (!query) {
      setPhotos([]);
      setLoading(false);
      return;
    }

    const cached = cache.get(`${query}::${count}`);
    if (cached) {
      setPhotos(cached);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    fetchPhotos(query, count).then((result) => {
      if (active) {
        setPhotos(result);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [query, count]);

  return { photos, loading };
}
