// Types TypeScript partagés pour ArtisanBF

export type Role = 'citoyen' | 'artisan' | 'admin';
export type StatutCommerce = 'brouillon' | 'publie' | 'depublie';
export type TypeSignalement = 'commerce' | 'avis';
export type StatutSignalement = 'en_cours' | 'resolu' | 'rejete';
export type SentimentAvis = 'positif' | 'neutre' | 'negatif';

export interface Utilisateur {
  id: string;
  nom: string;
  telephone?: string;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface Commerce {
  id: string;
  user_id: string;
  nom: string;
  description?: string;
  categorie_id?: string;
  telephone?: string;
  localisation?: string; // GEOGRAPHY(Point, 4326)
  adresse_texte?: string;
  statut: StatutCommerce;
  note_moyenne: number;
  nb_avis: number;
  created_at: string;
  updated_at: string;
}

export interface Avis {
  id: string;
  commerce_id: string;
  user_id: string;
  note: number;
  commentaire?: string;
  sentiment?: SentimentAvis;
  is_spam?: boolean;
  resume_ia?: string;
  created_at: string;
}

export interface Categorie {
  id: string;
  nom: string;
  icone?: string;
  created_at: string;
}

export interface Signalement {
  id: string;
  type_cible: TypeSignalement;
  cible_id: string;
  user_id: string;
  raison: string;
  statut: StatutSignalement;
  created_at: string;
  updated_at: string;
}

export interface StatistiquesCommerce {
  id: string;
  commerce_id: string;
  vues: number;
  appels: number;
  clics_whatsapp: number;
  date: string;
  created_at: string;
}

export interface PhotoCommerce {
  id: string;
  commerce_id: string;
  url: string;
  ordre: number;
}

export interface CommerceProche extends Commerce {
  distance_meters: number;
}

export interface SearchResult {
  commerces: CommerceProche[];
  total: number;
}
