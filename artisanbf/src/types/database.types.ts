// Types Supabase simplifiés pour ArtisanBF

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface UtilisateursRow {
  id: string
  nom: string
  telephone: string | null
  role: 'citoyen' | 'artisan' | 'admin'
  created_at: string
  updated_at: string
}

export interface UtilisateursInsert {
  id: string
  nom: string
  telephone?: string | null
  role?: 'citoyen' | 'artisan' | 'admin'
  created_at?: string
  updated_at?: string
}

export interface UtilisateursUpdate {
  id?: string
  nom?: string
  telephone?: string | null
  role?: 'citoyen' | 'artisan' | 'admin'
  created_at?: string
  updated_at?: string
}

export interface CommercesRow {
  id: string
  user_id: string
  nom: string
  description: string | null
  categorie_id: string | null
  telephone: string | null
  localisation: string | null
  adresse_texte: string | null
  statut: 'brouillon' | 'publie' | 'depublie'
  note_moyenne: number
  nb_avis: number
  created_at: string
  updated_at: string
}

export interface CommercesInsert {
  id?: string
  user_id: string
  nom: string
  description?: string | null
  categorie_id?: string | null
  telephone?: string | null
  localisation?: string | null
  adresse_texte?: string | null
  statut?: 'brouillon' | 'publie' | 'depublie'
  note_moyenne?: number
  nb_avis?: number
  created_at?: string
  updated_at?: string
}

export interface CommercesUpdate {
  id?: string
  user_id?: string
  nom?: string
  description?: string | null
  categorie_id?: string | null
  telephone?: string | null
  localisation?: string | null
  adresse_texte?: string | null
  statut?: 'brouillon' | 'publie' | 'depublie'
  note_moyenne?: number
  nb_avis?: number
  created_at?: string
  updated_at?: string
}

export interface AvisRow {
  id: string
  commerce_id: string
  user_id: string
  note: number
  commentaire: string | null
  sentiment: 'positif' | 'neutre' | 'negatif' | null
  is_spam: boolean | null
  resume_ia: string | null
  created_at: string
}

export interface AvisInsert {
  id?: string
  commerce_id: string
  user_id: string
  note: number
  commentaire?: string | null
  sentiment?: 'positif' | 'neutre' | 'negatif' | null
  is_spam?: boolean | null
  resume_ia?: string | null
  created_at?: string
}

export interface AvisUpdate {
  id?: string
  commerce_id?: string
  user_id?: string
  note?: number
  commentaire?: string | null
  sentiment?: 'positif' | 'neutre' | 'negatif' | null
  is_spam?: boolean | null
  resume_ia?: string | null
  created_at?: string
}

export interface Database {
  public: {
    Tables: {
      utilisateurs: {
        Row: UtilisateursRow
        Insert: UtilisateursInsert
        Update: UtilisateursUpdate
      }
      commerces: {
        Row: CommercesRow
        Insert: CommercesInsert
        Update: CommercesUpdate
      }
      avis: {
        Row: AvisRow
        Insert: AvisInsert
        Update: AvisUpdate
      }
      categories: {
        Row: {
          id: string
          nom: string
          icone: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nom: string
          icone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nom?: string
          icone?: string | null
          created_at?: string
        }
      }
      signalements: {
        Row: {
          id: string
          type_cible: 'commerce' | 'avis'
          cible_id: string
          user_id: string
          raison: string
          statut: 'en_cours' | 'resolu' | 'rejete'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type_cible: 'commerce' | 'avis'
          cible_id: string
          user_id: string
          raison: string
          statut?: 'en_cours' | 'resolu' | 'rejete'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type_cible?: 'commerce' | 'avis'
          cible_id?: string
          user_id?: string
          raison?: string
          statut?: 'en_cours' | 'resolu' | 'rejete'
          created_at?: string
          updated_at?: string
        }
      }
      statistiques_commerces: {
        Row: {
          id: string
          commerce_id: string
          vues: number
          appels: number
          clics_whatsapp: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          commerce_id: string
          vues?: number
          appels?: number
          clics_whatsapp?: number
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          commerce_id?: string
          vues?: number
          appels?: number
          clics_whatsapp?: number
          date?: string
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {
      get_commerces_proches: {
        Args: {
          p_latitude: number
          p_longitude: number
          p_radius_meters?: number
          p_limit?: number
        }
        Returns: Array<{
          id: string
          nom: string
          description: string
          telephone: string
          adresse_texte: string
          note_moyenne: number
          nb_avis: number
          distance_meters: number
          localisation: string
        }>
      }
      search_commerces: {
        Args: {
          p_search_text: string
          p_latitude?: number
          p_longitude?: number
          p_radius_meters?: number
          p_limit?: number
        }
        Returns: Array<{
          id: string
          nom: string
          description: string
          telephone: string
          adresse_texte: string
          note_moyenne: number
          nb_avis: number
          distance_meters: number
        }>
      }
    }
    Enums: {}
  }
}
