'use client';

import { useEffect, useMemo } from 'react';
import { useSearchStore } from '@/stores/search.store';
import { useCommerceStore, loadCommerces } from '@/stores/commerce.store';
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
      loadCommerces();
    }
  }, [commerces.length]);

  const results: Commerce[] = useMemo(() => {
    let result = [...commerces];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (c) =>
          c.nom.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.ville.toLowerCase().includes(q)
      );
    }
    if (categorieId) {
      result = result.filter((c) => c.categorieId === categorieId);
    }
    if (ville) {
      result = result.filter(
        (c) => c.ville.toLowerCase() === ville.toLowerCase()
      );
    }
    if (noteMin) {
      result = result.filter((c) => c.note >= noteMin);
    }

    switch (tri) {
      case 'note':
        result.sort((a, b) => b.note - a.note);
        break;
      case 'date':
        result.sort(
          (a, b) =>
            new Date(b.dateCreation).getTime() -
            new Date(a.dateCreation).getTime()
        );
        break;
    }

    return result;
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
