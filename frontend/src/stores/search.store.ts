import { create } from 'zustand';
import type { TriOption } from '@/types/common';

interface SearchState {
  query: string;
  categorieId: string | null;
  ville: string | null;
  noteMin: number | null;
  rayon: number | null;
  tri: TriOption;
  setQuery: (query: string) => void;
  setCategorie: (id: string | null) => void;
  setVille: (ville: string | null) => void;
  setNoteMin: (note: number | null) => void;
  setRayon: (rayon: number | null) => void;
  setTri: (tri: TriOption) => void;
  resetFilters: () => void;
}

const initialState = {
  query: '',
  categorieId: null,
  ville: null,
  noteMin: null,
  rayon: null,
  tri: 'relevance' as TriOption,
};

export const useSearchStore = create<SearchState>((set) => ({
  ...initialState,

  setQuery: (query) => set({ query }),
  setCategorie: (categorieId) => set({ categorieId }),
  setVille: (ville) => set({ ville }),
  setNoteMin: (noteMin) => set({ noteMin }),
  setRayon: (rayon) => set({ rayon }),
  setTri: (tri) => set({ tri }),
  resetFilters: () => set(initialState),
}));
