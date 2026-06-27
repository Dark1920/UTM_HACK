export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Adresse {
  rue: string;
  ville: string;
  pays: string;
  codePostal?: string;
}

export type TriOption = 'distance' | 'note' | 'date' | 'relevance';

export interface FiltreRecherche {
  recherche?: string;
  categorieId?: string;
  ville?: string;
  noteMin?: number;
  rayon?: number;
  tri: TriOption;
}