export interface StatistiquesCommerces {
  nombreVues: number;
  nombreAppels: number;
  nombreClicsWhatsApp: number;
  evolution: EvolutionPoint[];
}

export interface EvolutionPoint {
  date: string;
  valeur: number;
}

export interface StatistiquesGlobales {
  totalUtilisateurs: number;
  totalCommerces: number;
  totalCommentaires: number;
  totalVues: number;
  commercesParCategorie: { categorie: string; nombre: number }[];
  activiteRecente: { date: string; type: string; description: string }[];
}