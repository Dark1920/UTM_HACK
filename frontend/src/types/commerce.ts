export interface Commerce {
  id: string;
  nom: string;
  description: string;
  categorieId: string;
  categorie?: Categorie;
  artisanId: string;
  artisan?: import('./utilisateur').Utilisateur;
  adresse: string;
  ville: string;
  latitude: number;
  longitude: number;
  telephone: string;
  whatsapp?: string;
  email?: string;
  photos: string[];
  note: number;
  nombreAvis: number;
  nombreVues: number;
  nombreAppels: number;
  nombreClicsWhatsApp: number;
  estPublic: boolean;
  dateCreation: string;
  dateModification: string;
}

export interface Categorie {
  id: string;
  nom: string;
  slug: string;
  icone: string;
  description?: string;
  nombreCommerces: number;
}

export interface CreateCommerceData {
  nom: string;
  description: string;
  categorieId: string;
  adresse: string;
  ville: string;
  latitude: number;
  longitude: number;
  telephone: string;
  whatsapp?: string;
  email?: string;
  photos?: string[];
}