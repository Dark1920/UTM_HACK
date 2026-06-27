export interface VoiceSearchResult {
  texte: string;
  intention: 'recherche' | 'commentaire' | 'incomprehensible';
  categorie: string | null;
  quartier: string | null;
  urgence: boolean;
}

export const voiceSearchService = {
  async search(audioFile: File): Promise<VoiceSearchResult> {
    const formData = new FormData();
    formData.append('audio', audioFile);

    const res = await fetch('/api/ai/voice-search', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Erreur recherche vocale');
    return res.json();
  },

  async transcribe(audioFile: File): Promise<string> {
    const formData = new FormData();
    formData.append('audio', audioFile);

    const res = await fetch('/api/ai/speech-to-text', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Erreur transcription');
    const data = await res.json();
    return data.text;
  },
};
