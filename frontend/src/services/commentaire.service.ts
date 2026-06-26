import { mockCommentaires } from '@/lib/mock-data';
import type { Commentaire } from '@/types/commentaire';

const commentaires = [...mockCommentaires];

export const commentaireService = {
  async getByCommerceId(commerceId: string): Promise<Commentaire[]> {
    await new Promise(r => setTimeout(r, 250));
    return commentaires
      .filter(c => c.commerceId === commerceId && c.estModer && !c.estSpam)
      .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
  },

  async create(data: {
    texte: string;
    note: number;
    auteurId: string;
    commerceId: string;
  }): Promise<Commentaire> {
    await new Promise(r => setTimeout(r, 400));
    const newCommentaire: Commentaire = {
      id: 'com-' + Date.now(),
      texte: data.texte,
      note: data.note,
      auteurId: data.auteurId,
      commerceId: data.commerceId,
      iaScore: Math.random() * 0.5 + 0.5,
      iaResume: 'Avis client sur le service.',
      estSpam: false,
      estModer: true,
      dateCreation: new Date().toISOString(),
    };
    commentaires.push(newCommentaire);
    return newCommentaire;
  },

  async delete(id: string): Promise<void> {
    await new Promise(r => setTimeout(r, 300));
    const index = commentaires.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Commentaire non trouvé');
    commentaires.splice(index, 1);
  },

  async getAll(): Promise<Commentaire[]> {
    await new Promise(r => setTimeout(r, 300));
    return [...commentaires];
  },
};
