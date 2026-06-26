const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';

export async function analyseSentiment(texte: string): Promise<{ note: number; sentiment: string }> {
  // Mock pour le prototype
  return {
    note: Math.floor(Math.random() * 3) + 3,
    sentiment: texte.length > 50 ? 'positif' : 'neutre',
  };
}

export async function genererResume(avis: string[]): Promise<string> {
  // Mock pour le prototype
  if (avis.length === 0) return 'Aucun avis pour le moment.';
  return `Les clients apprécient la qualité du travail et les tarifs abordables. ${avis.length} avis au total.`;
}

export async function detecterSpam(texte: string): Promise<{ estSpam: boolean; raison?: string }> {
  // Mock pour le prototype
  const spamPatterns = [/\b(cliquez ici|gagnez|gratuit|offre speciale)\b/i];
  for (const pattern of spamPatterns) {
    if (pattern.test(texte)) return { estSpam: true, raison: 'Contenu détecté comme spam' };
  }
  return { estSpam: false };
}
