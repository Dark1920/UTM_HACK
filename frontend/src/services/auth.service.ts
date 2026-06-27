import { supabase } from '@/lib/supabase/client';
import type { User } from '@/types/auth';

function supabaseUserToUser(supabaseUser: { id: string; email?: string; user_metadata?: Record<string, string>; created_at?: string; updated_at?: string }): User {
  const meta = supabaseUser.user_metadata || {};
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    nom: meta.nom || '',
    prenom: meta.prenom || '',
    telephone: meta.telephone,
    role: (meta.role as 'citoyen' | 'artisan' | 'admin') || 'citoyen',
    avatar: meta.avatar,
    dateCreation: supabaseUser.created_at || new Date().toISOString(),
    dateModification: supabaseUser.updated_at || new Date().toISOString(),
  };
}

export const authService = {
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return { user: supabaseUserToUser(data.user), token: data.session.access_token };
  },

  async register(data: { email: string; password: string; nom: string; prenom: string; telephone?: string; role?: string }) {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { nom: data.nom, prenom: data.prenom, telephone: data.telephone, role: data.role || 'citoyen' },
      },
    });
    if (error) throw new Error(error.message);
    if (!authData.user) throw new Error('Inscription échouée');
    return { user: supabaseUserToUser(authData.user), token: authData.session?.access_token || '' };
  },

  async logout() {
    await supabase.auth.signOut();
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw new Error(error.message);
  },
};
