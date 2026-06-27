'use client';

import { useCallback } from 'react';
import { useFavoriteStore } from '@/stores/favorite.store';

export function useFavorites() {
  const favoris = useFavoriteStore((s) => s.favoris);
  const toggleFavori = useFavoriteStore((s) => s.toggleFavori);
  const isFavoriFn = useFavoriteStore((s) => s.isFavori);

  const isFavori = useCallback(
    (commerceId: string) => favoris.includes(commerceId),
    [favoris]
  );

  return { favoris, toggleFavori, isFavori };
}
