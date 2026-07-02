import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/api';

export const groqService = {
  /**
   * Analyse de sentiment via IA (Groq)
   */
  async analyseSentiment(texte: string): Promise<{ pertinent: boolean; sentiment: string; note: number; confiance: number; motifs: string[] }> {
    const response = await apiClient.post<{ analyse: any }>(
      API_ENDPOINTS.IA.ANALYZE,
      { texte }
    );
    return response.analyse;
  },

  /**
   * Générer un résumé d'avis via IA
   */
  async genererResume(texte: string): Promise<{ resume: string; points_forts: string[]; points_faibles: string[] }> {
    const response = await apiClient.post<{ resume: any }>(
      API_ENDPOINTS.IA.SUMMARIZE,
      { texte }
    );
    return response.resume;
  },

  /**
   * Détection de spam via IA
   */
  async detecterSpam(texte: string): Promise<{ pertinent: boolean; spam: boolean; score: number }> {
    const response = await apiClient.post<{ analyse: any }>(
      API_ENDPOINTS.IA.ANALYZE,
      { texte }
    );
    return {
      spam: !response.analyse.pertinent,
      score: response.analyse.confiance,
      pertinent: response.analyse.pertinent
    };
  },

  /**
   * Réponse automatique à un avis
   */
  async repondreAvis(avis: string, note: number): Promise<string> {
    // Utiliser l'IA pour générer une réponse contextuelle
    const prompt = `Génère une réponse professionnelle à cet avis client (${note}/5 étoiles) : "${avis}"`;
    
    const response = await apiClient.post<{ resume: any }>(
      API_ENDPOINTS.IA.SUMMARIZE,
      { texte: prompt }
    );
    
    return response.resume.resume || 'Merci pour votre avis.';
  },
};
