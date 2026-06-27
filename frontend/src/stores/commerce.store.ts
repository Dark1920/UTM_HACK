import { create } from 'zustand';
import type { Commerce } from '@/types/commerce';
import type { FiltreRecherche } from '@/types/common';
import { commerceService } from '@/services/commerce.service';

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
    let result = [...commerces];

    if (filters.recherche) {
      const q = filters.recherche.toLowerCase();
      result = result.filter(
        (c) =>
          c.nom.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }
    if (filters.categorieId) {
      result = result.filter((c) => c.categorieId === filters.categorieId);
    }
    if (filters.ville) {
      result = result.filter(
        (c) => c.ville.toLowerCase() === filters.ville!.toLowerCase()
      );
    }
    if (filters.noteMin) {
      result = result.filter((c) => c.note >= filters.noteMin!);
    }

    switch (filters.tri) {
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
      case 'distance':
        break;
      default:
        break;
    }

    return result;
  },
}));
