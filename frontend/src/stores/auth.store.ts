import { create } from 'zustand';
import type { User, UserRole } from '@/types/auth';
import { mockArtisans, mockCitoyens } from '@/lib/mock-data';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    nom: string;
    prenom: string;
    telephone?: string;
    role: UserRole;
  }) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

function getMockUserByEmail(email: string): User | null {
  const allUsers = [...mockArtisans, ...mockCitoyens];
  const found = allUsers.find((u) => u.email === email);
  if (found) {
    return {
      id: found.id,
      email: found.email,
      nom: found.nom,
      prenom: found.prenom,
      telephone: found.telephone,
      role: found.role,
      avatar: found.avatar,
      dateCreation: found.dateCreation,
      dateModification: found.dateCreation,
    };
  }

  let role: UserRole = 'citoyen';
  if (email.toLowerCase().includes('admin')) role = 'admin';
  else if (email.toLowerCase().includes('artisan')) role = 'artisan';

  return {
    id: `user-${Date.now()}`,
    email,
    nom: 'Utilisateur',
    prenom: 'Test',
    role,
    dateCreation: new Date().toISOString(),
    dateModification: new Date().toISOString(),
  };
}

function loadUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('auth-user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveUser(user: User | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('auth-user', JSON.stringify(user));
  } else {
    localStorage.removeItem('auth-user');
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: loadUser(),
  isLoading: false,
  isAuthenticated: loadUser() !== null,

  login: async (email: string, _password: string) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 500));
    const user = getMockUserByEmail(email);
    saveUser(user);
    set({ user, isLoading: false, isAuthenticated: user !== null });
  },

  register: async (data) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 500));
    const user: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      nom: data.nom,
      prenom: data.prenom,
      telephone: data.telephone,
      role: data.role,
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString(),
    };
    saveUser(user);
    set({ user, isLoading: false, isAuthenticated: true });
  },

  logout: () => {
    saveUser(null);
    set({ user: null, isAuthenticated: false });
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 800));
    set({ isLoading: false });
  },
}));
