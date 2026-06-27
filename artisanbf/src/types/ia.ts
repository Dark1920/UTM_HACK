// Types pour l'intégration IA (stub pour l'équipe IA)

export interface AnalyseIAResult {
  sentiment: 'positif' | 'neutre' | 'negatif';
  score: number; // Entre -1 et 1
  resume?: string; // Résumé généré par IA
  isSpam: boolean;
  confiance?: number; // Score de confiance entre 0 et 1
}

export interface AnalyseAvisInput {
  commentaire: string;
  commerceId: string;
  note?: number;
}

// ============================================
// TODO[IA-TEAM]: Interface pour l'Edge Function Supabase "analyze-review"
//
// L'Edge Function doit:
// 1. Recevoir { commentaire, commerceId, note }
// 2. Analyser le sentiment du commentaire
// 3. Générer un résumé (optionnel)
// 4. Détecter si c'est du spam
// 5. Retourner { sentiment, score, resume, isSpam, confiance }
//
// Ne PAS implémenter ici — ce fichier définit seulement le contrat.
// ============================================
