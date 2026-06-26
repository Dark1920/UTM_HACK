export const groqService = {
  async analyseSentiment(texte: string): Promise<{ note: number; confiance: number }> {
    await new Promise(r => setTimeout(r, 600));
    return {
      note: Math.floor(Math.random() * 5) + 1,
      confiance: Math.random() * 0.4 + 0.6,
    };
  },

  async genererResume(texte: string): Promise<string> {
    await new Promise(r => setTimeout(r, 700));
    const resumes = [
      'Client satisfait du service rendu.',
      'Travail de qualité effectué dans les délais.',
      'Recommande vivement cet artisan.',
      'Bon rapport qualité-prix.',
      'Intervention rapide et professionnelle.',
    ];
    return resumes[Math.floor(Math.random() * resumes.length)];
  },

  async detecterSpam(texte: string): Promise<{ estSpam: boolean; score: number }> {
    await new Promise(r => setTimeout(r, 400));
    return {
      estSpam: Math.random() < 0.05,
      score: Math.random() * 0.3,
    };
  },

  async repondreAvis(avis: string, note: number): Promise<string> {
    await new Promise(r => setTimeout(r, 500));
    if (note >= 4) {
      return 'Merci beaucoup pour votre avis positif ! Nous sommes ravis de vous avoir satisfait.';
    }
    return 'Merci pour votre retour. Nous prenons note de vos remarques pour nous améliorer.';
  },
};
