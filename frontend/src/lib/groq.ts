export async function analyseSentiment(texte: string): Promise<{ note: number; sentiment: string; pertinent: boolean }> {
  const res = await fetch('/api/ai/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commentaire: texte }),
  });
  if (!res.ok) throw new Error('Erreur analyse IA');
  return res.json();
}

export async function genererResume(avis: string[]): Promise<{ resume: string; points_forts: string[]; points_faibles: string[] }> {
  if (avis.length === 0) return { resume: 'Aucun avis pour le moment.', points_forts: [], points_faibles: [] };
  const res = await fetch('/api/ai/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commentaires: avis }),
  });
  if (!res.ok) throw new Error('Erreur résumé IA');
  return res.json();
}

export async function detecterSpam(texte: string): Promise<{ estSpam: boolean; raison?: string }> {
  const res = await fetch('/api/ai/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commentaire: texte }),
  });
  if (!res.ok) return { estSpam: false };
  const data = await res.json();
  if (!data.pertinent) return { estSpam: true, raison: data.raison || 'Contenu détecté comme spam' };
  return { estSpam: false };
}
