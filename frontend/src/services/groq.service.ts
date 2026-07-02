import { apiFetch } from '@/lib/api-client';

interface AnalyseResult {
  pertinent: boolean;
  note: number;
  sentiment: 'positif' | 'neutre' | 'negatif';
  criteres: { qualite: number; professionnalisme: number; rapidite: number; prix: number };
  points_forts: string[];
  points_faibles: string[];
  raison: string;
}

export const groqService = {
  async analyseSentiment(texte: string): Promise<AnalyseResult> {
    return apiFetch<AnalyseResult>('/api/ai/analyze', {
      method: 'POST',
      body: { commentaire: texte },
    });
  },

  async genererResume(textes: string[]): Promise<{ resume: string; points_forts: string[]; points_faibles: string[] }> {
    return apiFetch('/api/ai/summarize', {
      method: 'POST',
      body: { commentaires: textes },
    });
  },

  async detecterSpam(texte: string): Promise<{ estSpam: boolean; score: number }> {
    try {
      const data = await apiFetch<AnalyseResult>('/api/ai/analyze', {
        method: 'POST',
        body: { commentaire: texte },
      });
      return { estSpam: !data.pertinent, score: data.note ? (5 - data.note) / 5 : 0 };
    } catch {
      return { estSpam: false, score: 0 };
    }
  },

  async repondreAvis(_avis: string, _note: number): Promise<string> {
    return 'Merci pour votre avis.';
  },
};
