import { create } from 'zustand';

interface FavoriteState {
  favoris: string[];
  toggleFavori: (commerceId: string) => void;
  isFavori: (commerceId: string) => boolean;
  loadFavoris: () => void;
}

function loadFromStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('favoris');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToStorage(favoris: string[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('favoris', JSON.stringify(favoris));
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favoris: loadFromStorage(),

  toggleFavori: (commerceId) => {
    const { favoris } = get();
    const exists = favoris.includes(commerceId);
    const updated = exists
      ? favoris.filter((id) => id !== commerceId)
      : [...favoris, commerceId];
    saveToStorage(updated);
    set({ favoris: updated });
  },

  isFavori: (commerceId) => {
    return get().favoris.includes(commerceId);
  },

  loadFavoris: () => {
    const favoris = loadFromStorage();
    set({ favoris });
  },
}));
