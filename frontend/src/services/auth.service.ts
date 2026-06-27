import { mockArtisans, mockCitoyens } from '@/lib/mock-data';

const mockUtilisateurs = [...mockArtisans, ...mockCitoyens];

export const authService = {
  async login(email: string, password: string) {
    await new Promise(r => setTimeout(r, 500));
    const user = mockUtilisateurs.find(u => u.email === email);
    if (!user) throw new Error('Email ou mot de passe incorrect');
    return { user, token: 'mock-token-' + user.id };
  },

  async register(data: { email: string; password: string; nom: string; prenom: string }) {
    await new Promise(r => setTimeout(r, 500));
    return {
      user: {
        ...data,
        id: 'new-' + Date.now(),
        role: 'citoyen' as const,
        estActif: true,
        dateCreation: new Date().toISOString(),
      },
      token: 'mock-token-new',
    };
  },

  async logout() {
    await new Promise(r => setTimeout(r, 200));
  },

  async resetPassword(email: string) {
    await new Promise(r => setTimeout(r, 500));
  },
};
