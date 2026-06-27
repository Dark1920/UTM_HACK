import type { Commentaire } from '@/types/commentaire';

const API = '/api/avis';

function authHeaders(json = false): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('supabase_token') : null;
  const headers: Record<string, string> = {};
  if (json) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export const commentaireService = {
  async getByCommerceId(commerceId: string): Promise<Commentaire[]> {
    const res = await fetch(`${API}?commerceId=${encodeURIComponent(commerceId)}`);
    if (!res.ok) throw new Error('Erreur chargement avis');
    const data = await res.json();
    return data.avis || [];
  },

  async create(data: {
    texte: string;
    note: number;
    auteurId: string;
    commerceId: string;
  }): Promise<Commentaire> {
    const res = await fetch(API, {
      method: 'POST',
      headers: authHeaders(true),
      body: JSON.stringify({
        commerce_id: data.commerceId,
        texte: data.texte,
        note: data.note,
      }),
    });
    if (!res.ok) throw new Error('Erreur création avis');
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Erreur suppression avis');
  },
};
