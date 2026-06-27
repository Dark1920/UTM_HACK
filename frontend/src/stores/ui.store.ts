import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface UIState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  theme: Theme;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  setTheme: (theme: Theme) => void;
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  mobileMenuOpen: false,
  theme: getInitialTheme(),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  toggleMobileMenu: () =>
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    set({ theme });
  },
}));
