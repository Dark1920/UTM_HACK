import type { Commentaire } from '@/types/commentaire';

export const commentaireService = {
  async getByCommerceId(commerceId: string): Promise<Commentaire[]> {
    const res = await fetch(`/api/avis?commerceId=${encodeURIComponent(commerceId)}`);
    if (!res.ok) throw new Error('Erreur chargement avis');
    return res.json();
  },

  async create(data: {
    texte: string;
    note: number;
    auteurId: string;
    commerceId: string;
  }): Promise<Commentaire> {
    const res = await fetch('/api/avis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commerceId: data.commerceId,
        texte: data.texte,
        note: data.note,
      }),
    });
    if (!res.ok) throw new Error('Erreur création avis');
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/avis/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Erreur suppression avis');
  },

  async getAll(): Promise<Commentaire[]> {
    const res = await fetch('/api/avis');
    if (!res.ok) throw new Error('Erreur chargement avis');
    return res.json();
  },
};
