import { create } from 'zustand';
import type { User, UserRole } from '@/types/auth';
import { authService } from '@/services/auth.service';

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

function saveToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('supabase_token', token);
    // Also set as cookie so Next.js middleware can read it
    document.cookie = `supabase_token=${token}; path=/; max-age=86400; SameSite=Lax`;
  } else {
    localStorage.removeItem('supabase_token');
    // Clear the cookie
    document.cookie = 'supabase_token=; path=/; max-age=0';
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: loadUser(),
  isLoading: false,
  isAuthenticated: loadUser() !== null,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(email, password);
      const { user: supabaseUser, profil, session } = response;

      const user: User = {
        id: supabaseUser?.id || profil?.id || '',
        email: supabaseUser?.email || email,
        nom: profil?.nom || 'Utilisateur',
        prenom: profil?.prenom || '',
        telephone: profil?.telephone,
        role: (profil?.role as UserRole) || 'citoyen',
        avatar: profil?.avatar,
        dateCreation: profil?.created_at || new Date().toISOString(),
        dateModification: profil?.updated_at || new Date().toISOString(),
      };

      saveUser(user);
      saveToken(session?.access_token || null);
      set({ user, isLoading: false, isAuthenticated: true });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const response = await authService.register({
        email: data.email,
        password: data.password,
        nom: data.nom,
        prenom: data.prenom,
        role: data.role,
      });
      const { user: supabaseUser, profil, session } = response;

      const user: User = {
        id: supabaseUser?.id || profil?.id || '',
        email: supabaseUser?.email || data.email,
        nom: profil?.nom || data.nom,
        prenom: profil?.prenom || data.prenom,
        telephone: profil?.telephone || data.telephone,
        role: (profil?.role as UserRole) || data.role,
        avatar: profil?.avatar,
        dateCreation: profil?.created_at || new Date().toISOString(),
        dateModification: profil?.updated_at || new Date().toISOString(),
      };

      saveUser(user);
      saveToken(session?.access_token || null);
      set({ user, isLoading: false, isAuthenticated: true });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // Continue logout even if API call fails
    }
    saveUser(null);
    saveToken(null);
    set({ user: null, isAuthenticated: false });
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true });
    try {
      await authService.resetPassword(email);
    } finally {
      set({ isLoading: false });
    }
  },
}));
