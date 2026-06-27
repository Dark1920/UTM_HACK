import { supabase } from '@/lib/supabase/client';
import type { User } from '@/types/auth';

const API = '/api/auth';

function toUser(raw: Record<string, unknown>): User {
  return {
    id: raw.id as string,
    email: (raw.email as string) || '',
    nom: (raw.nom as string) || '',
    prenom: (raw.prenom as string) || '',
    telephone: (raw.telephone as string) || undefined,
    role: (raw.role as User['role']) || 'citoyen',
    avatar: (raw.avatar as string) || undefined,
    dateCreation: (raw.dateCreation as string) || new Date().toISOString(),
    dateModification: (raw.dateModification as string) || new Date().toISOString(),
  };
}

export const authService = {
  async login(email: string, password: string) {
    const res = await fetch(`${API}/connexion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur de connexion');
    return { user: toUser(data.user), token: (data.token as string) || '' };
  },

  async register(data: { email: string; password: string; nom: string; prenom: string; telephone?: string; role?: string }) {
    const res = await fetch(`${API}/inscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Inscription échouée');
    return { user: toUser(json.user), token: (json.token as string) || '' };
  },

  async logout() {
    // Session côté backend stateless (token JWT Supabase) : rien à révoquer ici.
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw new Error(error.message);
  },
};
