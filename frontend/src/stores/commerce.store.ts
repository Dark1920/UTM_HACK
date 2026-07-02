import { create } from 'zustand';
import type { Commerce } from '@/types/commerce';
import type { FiltreRecherche } from '@/types/common';
import { commerceService } from '@/services/commerce.service';
import { filterCommerces, sortCommerces } from '@/utils/filter-commerces';

interface CommerceState {
  commerces: Commerce[];
  selectedCommerce: Commerce | null;
  isLoading: boolean;
  filters: FiltreRecherche;
  setCommerces: (commerces: Commerce[]) => void;
  selectCommerce: (commerce: Commerce | null) => void;
  setFilters: (filters: Partial<FiltreRecherche>) => void;
  filteredCommerces: () => Commerce[];
  loadCommerces: (filters?: Parameters<typeof commerceService.getAll>[0]) => Promise<void>;
}

export const useCommerceStore = create<CommerceState>((set, get) => ({
  commerces: [],
  selectedCommerce: null,
  isLoading: false,
  filters: { tri: 'relevance' },

  setCommerces: (commerces) => set({ commerces }),

  selectCommerce: (commerce) => set({ selectedCommerce: commerce }),

  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  loadCommerces: async (filters) => {
    set({ isLoading: true });
    try {
      const commerces = await commerceService.getAll(filters);
      set({ commerces, isLoading: false });
    } catch (error) {
      console.error('Erreur chargement commerces:', error);
      set({ isLoading: false });
    }
  },

  filteredCommerces: () => {
    const { commerces, filters } = get();
    const filtered = filterCommerces(commerces, {
      recherche: filters.recherche,
      categorieId: filters.categorieId,
      ville: filters.ville,
      noteMin: filters.noteMin,
    });
    return sortCommerces(filtered, filters.tri);
  },
}));
