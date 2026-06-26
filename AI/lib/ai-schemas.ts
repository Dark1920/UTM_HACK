export interface CritereNote {
  qualite: number
  professionnalisme: number
  rapidite: number
  prix: number
}

export interface ReviewAnalysis {
  pertinent: boolean
  note: number
  sentiment: "positif" | "neutre" | "negatif"
  criteres: CritereNote
  points_forts: string[]
  points_faibles: string[]
  raison: string
}

export interface Summary {
  resume: string
  points_forts: string[]
  points_faibles: string[]
}

export interface AnalyzeRequest {
  commentaire: string
}

export interface SummarizeRequest {
  commentaires: string[]
}
