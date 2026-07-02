import { supabase } from '@/lib/supabase/client';
import type { User } from '@/types/auth';
import { apiFetch } from '@/lib/api-client';

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
    const data = await apiFetch<{ user: Record<string, unknown>; token?: string }>(
      `${API}/connexion`,
      { method: 'POST', body: { email, password } }
    );
    return { user: toUser(data.user), token: data.token || '' };
  },

  async register(data: { email: string; password: string; nom: string; prenom: string; telephone?: string; role?: string }) {
    const json = await apiFetch<{ user: Record<string, unknown>; token?: string }>(
      `${API}/inscription`,
      { method: 'POST', body: data }
    );
    return { user: toUser(json.user), token: json.token || '' };
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
