export interface Commentaire {
  id: string;
  texte: string;
  note: number;
  auteurId: string;
  auteur?: import('./utilisateur').Utilisateur;
  commerceId: string;
  commerce?: import('./commerce').Commerce;
  iaScore?: number;
  iaResume?: string;
  sentiment?: 'positif' | 'neutre' | 'negatif';
  estSpam: boolean;
  estModer: boolean;
  dateCreation: string;
}