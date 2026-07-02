// Types de la base de données Supabase.
// Alignés sur les migrations backend/supabase/migrations/*.sql
// (000_utilisateurs, 001_categories, 002_commerces, 003_avis).

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Role = 'citoyen' | 'artisan' | 'admin'
export type Sentiment = 'positif' | 'neutre' | 'negatif'

export interface Database {
  public: {
    Tables: {
      utilisateurs: {
        Row: {
          id: string
          nom: string
          prenom: string
          telephone: string | null
          role: Role
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nom: string
          prenom?: string
          telephone?: string | null
          role?: Role
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          prenom?: string
          telephone?: string | null
          role?: Role
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
          nombre_commerces: number
          created_at: string
        }
        Insert: {
          id?: string
          nom: string
          slug: string
          description?: string | null
          icone?: string | null
          couleur?: string | null
          nombre_commerces?: number
          created_at?: string
        }
        Update: {
          id?: string
          nom?: string
          slug?: string
          description?: string | null
          icone?: string | null
          couleur?: string | null
          nombre_commerces?: number
          created_at?: string
        }
      }
      commerces: {
        Row: {
          id: string
          nom: string
          description: string | null
          categorie_id: string | null
          artisan_id: string | null
          adresse: string
          ville: string
          latitude: number | null
          longitude: number | null
          telephone: string | null
          whatsapp: string | null
          email: string | null
          photos: string[]
          note_moyenne: number
          nombre_avis: number
          nombre_vues: number
          nombre_appels: number
          nombre_clics_whatsapp: number
          est_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nom: string
          description?: string | null
          categorie_id?: string | null
          artisan_id?: string | null
          adresse: string
          ville: string
          latitude?: number | null
          longitude?: number | null
          telephone?: string | null
          whatsapp?: string | null
          email?: string | null
          photos?: string[]
          note_moyenne?: number
          nombre_avis?: number
          nombre_vues?: number
          nombre_appels?: number
          nombre_clics_whatsapp?: number
          est_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          description?: string | null
          categorie_id?: string | null
          artisan_id?: string | null
          adresse?: string
          ville?: string
          latitude?: number | null
          longitude?: number | null
          telephone?: string | null
          whatsapp?: string | null
          email?: string | null
          photos?: string[]
          note_moyenne?: number
          nombre_avis?: number
          nombre_vues?: number
          nombre_appels?: number
          nombre_clics_whatsapp?: number
          est_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      avis: {
        Row: {
          id: string
          commerce_id: string
          user_id: string
          note: number
          commentaire: string | null
          sentiment: Sentiment | null
          score_sentiment: number
          is_spam: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          commerce_id: string
          user_id: string
          note: number
          commentaire?: string | null
          sentiment?: Sentiment | null
          score_sentiment?: number
          is_spam?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          commerce_id?: string
          user_id?: string
          note?: number
          commentaire?: string | null
          sentiment?: Sentiment | null
          score_sentiment?: number
          is_spam?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
