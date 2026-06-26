import { create } from 'zustand';

interface OfflineState {
  isOffline: boolean;
  lastSearches: string[];
  setOffline: (value: boolean) => void;
  addLastSearch: (query: string) => void;
  getLastSearches: () => string[];
}

export const useOfflineStore = create<OfflineState>((set, get) => ({
  isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
  lastSearches: [],

  setOffline: (value) => set({ isOffline: value }),

  addLastSearch: (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const { lastSearches } = get();
    const updated = [
      trimmed,
      ...lastSearches.filter((s) => s !== trimmed),
    ].slice(0, 20);
    set({ lastSearches: updated });
  },

  getLastSearches: () => get().lastSearches,
}));
