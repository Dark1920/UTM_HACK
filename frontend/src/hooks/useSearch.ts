'use client';

import { useEffect, useMemo } from 'react';
import { useSearchStore } from '@/stores/search.store';
import { useCommerceStore } from '@/stores/commerce.store';
import { filterCommerces, sortCommerces } from '@/utils/filter-commerces';
import type { Commerce } from '@/types/commerce';

export function useSearch() {
  const query = useSearchStore((s) => s.query);
  const categorieId = useSearchStore((s) => s.categorieId);
  const ville = useSearchStore((s) => s.ville);
  const noteMin = useSearchStore((s) => s.noteMin);
  const tri = useSearchStore((s) => s.tri);
  const setQuery = useSearchStore((s) => s.setQuery);
  const setCategorie = useSearchStore((s) => s.setCategorie);
  const setVille = useSearchStore((s) => s.setVille);
  const setNoteMin = useSearchStore((s) => s.setNoteMin);
  const setRayon = useSearchStore((s) => s.setRayon);
  const setTri = useSearchStore((s) => s.setTri);
  const resetFilters = useSearchStore((s) => s.resetFilters);

  const commerces = useCommerceStore((s) => s.commerces);
  const isLoading = useCommerceStore((s) => s.isLoading);

  useEffect(() => {
    if (commerces.length === 0) {
      useCommerceStore.getState().loadCommerces();
    }
  }, [commerces.length]);

  const results: Commerce[] = useMemo(() => {
    const filtered = filterCommerces(commerces, {
      recherche: query,
      categorieId,
      ville,
      noteMin: noteMin ?? undefined,
    });
    return sortCommerces(filtered, tri);
  }, [commerces, query, categorieId, ville, noteMin, tri]);

  return {
    results,
    isLoading,
    query,
    categorieId,
    ville,
    noteMin,
    tri,
    setQuery,
    setCategorie,
    setVille,
    setNoteMin,
    setRayon,
    setTri,
    resetFilters,
  };
}
