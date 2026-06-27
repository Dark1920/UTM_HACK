export const groqService = {
  async analyseSentiment(texte: string): Promise<{ note: number; sentiment: string; pertient: boolean; criteres: { qualite: number; professionnalisme: number; rapidite: number; prix: number }; points_forts: string[]; points_faibles: string[] }> {
    const res = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentaire: texte }),
    });
    if (!res.ok) throw new Error('Erreur analyse IA');
    return res.json();
  },

  async genererResume(textes: string[]): Promise<{ resume: string; points_forts: string[]; points_faibles: string[] }> {
    const res = await fetch('/api/ai/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentaires: textes }),
    });
    if (!res.ok) throw new Error('Erreur résumé IA');
    return res.json();
  },

  async detecterSpam(texte: string): Promise<{ estSpam: boolean; score: number }> {
    const res = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentaire: texte }),
    });
    if (!res.ok) return { estSpam: false, score: 0 };
    const data = await res.json();
    return { estSpam: !data.pertinent, score: data.note ? (5 - data.note) / 5 : 0 };
  },

  async repondreAvis(_avis: string, _note: number): Promise<string> {
    return 'Merci pour votre avis.';
  },
};
