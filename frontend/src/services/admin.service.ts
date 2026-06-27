import { mockCommerces, mockArtisans, mockCitoyens, mockStatistiques } from '@/lib/mock-data';
import type { Commerce } from '@/types/commerce';
import type { Utilisateur } from '@/types/utilisateur';

const mockUtilisateurs = [...mockArtisans, ...mockCitoyens];

export interface AdminStats {
  totalUtilisateurs: number;
  totalCommerces: number;
  totalCommentaires: number;
  totalVues: number;
  utilisateursActifs: number;
  commercesEnAttente: number;
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    await new Promise(r => setTimeout(r, 300));
    return {
      totalUtilisateurs: mockStatistiques.totalUtilisateurs,
      totalCommerces: mockStatistiques.totalCommerces,
      totalCommentaires: mockStatistiques.totalCommentaires,
      totalVues: mockStatistiques.totalVues,
      utilisateursActifs: mockUtilisateurs.filter(u => u.estActif).length,
      commercesEnAttente: 2,
    };
  },

  async getUsers(): Promise<Utilisateur[]> {
    await new Promise(r => setTimeout(r, 300));
    return [...mockUtilisateurs];
  },

  async getCommerces(): Promise<Commerce[]> {
    await new Promise(r => setTimeout(r, 300));
    return [...mockCommerces];
  },

  async toggleUserActive(userId: string): Promise<boolean> {
    await new Promise(r => setTimeout(r, 200));
    const user = mockUtilisateurs.find(u => u.id === userId);
    if (!user) throw new Error('Utilisateur non trouvé');
    user.estActif = !user.estActif;
    return user.estActif;
  },

  async toggleCommercePublic(commerceId: string): Promise<boolean> {
    await new Promise(r => setTimeout(r, 200));
    const commerce = mockCommerces.find(c => c.id === commerceId);
    if (!commerce) throw new Error('Commerce non trouvé');
    commerce.estPublic = !commerce.estPublic;
    return commerce.estPublic;
  },

  async deleteUser(userId: string): Promise<void> {
    await new Promise(r => setTimeout(r, 300));
    const index = mockUtilisateurs.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('Utilisateur non trouvé');
    mockUtilisateurs.splice(index, 1);
  },

  async deleteCommerce(commerceId: string): Promise<void> {
    await new Promise(r => setTimeout(r, 300));
    const index = mockCommerces.findIndex(c => c.id === commerceId);
    if (index === -1) throw new Error('Commerce non trouvé');
    mockCommerces.splice(index, 1);
  },
};
