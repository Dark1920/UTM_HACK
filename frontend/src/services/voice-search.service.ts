import { apiFetch } from '@/lib/api-client';

export interface VoiceSearchResult {
  texte: string;
  intention: 'recherche' | 'commentaire' | 'incomprehensible';
  categorie: string | null;
  quartier: string | null;
  urgence: boolean;
}

function audioForm(audioFile: File): FormData {
  const formData = new FormData();
  formData.append('audio', audioFile);
  return formData;
}

export const voiceSearchService = {
  async search(audioFile: File): Promise<VoiceSearchResult> {
    return apiFetch<VoiceSearchResult>('/api/ai/voice-search', {
      method: 'POST',
      body: audioForm(audioFile),
    });
  },

  async transcribe(audioFile: File): Promise<string> {
    const data = await apiFetch<{ text: string }>('/api/ai/speech-to-text', {
      method: 'POST',
      body: audioForm(audioFile),
    });
    return data.text;
  },
};
