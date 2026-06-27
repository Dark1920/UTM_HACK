// Types générés pour Supabase
// Ces types définissent la structure de la base de données

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      utilisateurs: {
        Row: {
          id: string
          nom: string
          telephone: string | null
          photo_url: string | null
          role: 'citoyen' | 'artisan' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nom: string
          telephone?: string | null
          photo_url?: string | null
          role?: 'citoyen' | 'artisan' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          telephone?: string | null
          photo_url?: string | null
          role?: 'citoyen' | 'artisan' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      commerces: {
        Row: {
          id: string
          user_id: string
          nom: string
          description: string | null
          categorie_id: string | null
          telephone: string | null
          email: string | null
          site_web: string | null
          adresse: string | null
          ville: string | null
          code_postal: string | null
          localisation: string | null
          statut: 'en_attente' | 'publie' | 'rejete' | 'suspendu'
          note_moyenne: number
          nombre_avis: number
          horaires: Json | null
          photo_principale: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nom: string
          description?: string | null
          categorie_id?: string | null
          telephone?: string | null
          email?: string | null
          site_web?: string | null
          adresse?: string | null
          ville?: string | null
          code_postal?: string | null
          localisation?: string | null
          statut?: 'en_attente' | 'publie' | 'rejete' | 'suspendu'
          note_moyenne?: number
          nombre_avis?: number
          horaires?: Json | null
          photo_principale?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nom?: string
          description?: string | null
          categorie_id?: string | null
          telephone?: string | null
          email?: string | null
          site_web?: string | null
          adresse?: string | null
          ville?: string | null
          code_postal?: string | null
          localisation?: string | null
          statut?: 'en_attente' | 'publie' | 'rejete' | 'suspendu'
          note_moyenne?: number
          nombre_avis?: number
          horaires?: Json | null
          photo_principale?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          nom: string
          slug: string
          description: string | null
          icone: string | null
          couleur: string | null
          parent_id: string | null
          created_at: string
        }
      }
      avis: {
        Row: {
          id: string
          commerce_id: string
          user_id: string
          note: number
          commentaire: string | null
          sentiment: 'positif' | 'neutre' | 'negatif' | null
          score_sentiment: number | null
          is_spam: boolean
          created_at: string
          updated_at: string
        }
      }
      signalements: {
        Row: {
          id: string
          commerce_id: string
          user_id: string
          motif: 'spam' | 'inapproprie' | 'fausse_info' | 'arnaque' | 'autre'
          description: string | null
          statut: 'en_cours' | 'traite' | 'ignore'
          created_at: string
          updated_at: string
        }
      }
      statistiques_commerces: {
        Row: {
          id: string
          commerce_id: string
          vues: number
          clics_telephone: number
          clics_email: number
          clics_site_web: number
          partages: number
          date_debut: string
          date_fin: string
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
