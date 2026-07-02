import type { Commerce, CreateCommerceData } from '@/types/commerce';
import type { Commentaire } from '@/types/commentaire';
import type { Utilisateur } from '@/types/utilisateur';

// ─── Commerce Mappers ────────────────────────────────────────────────────────

export function mapCommerceFromAPI(raw: Record<string, unknown>): Commerce {
  return {
    id: raw.id as string,
    nom: raw.nom as string,
    description: (raw.description as string) || '',
    categorieId: (raw.categorie_id as string) || (raw.categorieId as string) || '',
    artisanId: (raw.user_id as string) || (raw.artisanId as string) || '',
    adresse: (raw.localisation as string) || (raw.adresse as string) || '',
    ville: (raw.ville as string) || '',
    latitude: (raw.latitude as number) || 0,
    longitude: (raw.longitude as number) || 0,
    telephone: (raw.telephone as string) || '',
    whatsapp: raw.whatsapp as string | undefined,
    email: raw.email as string | undefined,
    photos: (raw.photos as string[]) || [],
    note: (raw.note_moyenne as number) ?? (raw.note as number) ?? 0,
    nombreAvis: (raw.nombre_avis as number) ?? (raw.nombreAvis as number) ?? 0,
    nombreVues: (raw.vues as number) ?? (raw.nombreVues as number) ?? 0,
    nombreAppels: (raw.clics_telephone as number) ?? (raw.nombreAppels as number) ?? 0,
    nombreClicsWhatsApp: (raw.clics_whatsapp as number) ?? (raw.nombreClicsWhatsApp as number) ?? 0,
    estPublic: raw.statut !== undefined
      ? raw.statut === 'publie'
      : (raw.estPublic as boolean) ?? true,
    dateCreation: (raw.created_at as string) || (raw.dateCreation as string) || new Date().toISOString(),
    dateModification: (raw.updated_at as string) || (raw.dateModification as string) || new Date().toISOString(),
  };
}

export function mapCommerceToAPI(data: CreateCommerceData): Record<string, unknown> {
  return {
    nom: data.nom,
    description: data.description,
    categorie: data.categorieId, // Now contains category name from the select
    localisation: data.adresse,
    adresse: data.adresse,
    ville: data.ville,
    latitude: data.latitude,
    longitude: data.longitude,
    telephone: data.telephone,
    whatsapp: data.whatsapp,
    email: data.email,
  };
}

// ─── Avis / Commentaire Mappers ─────────────────────────────────────────────

export function mapAvisFromAPI(raw: Record<string, unknown>): Commentaire {
  const analyseIA = raw.analyse_ia as Record<string, unknown> | null;

  return {
    id: raw.id as string,
    texte: (raw.commentaire as string) || (raw.texte as string) || '',
    note: (raw.note as number) || 0,
    auteurId: (raw.user_id as string) || (raw.auteurId as string) || '',
    commerceId: (raw.commerce_id as string) || (raw.commerceId as string) || '',
    iaScore: (raw.score_sentiment as number) ?? (raw.iaScore as number) ?? undefined,
    iaResume: analyseIA?.resume as string
      ?? (raw.iaResume as string)
      ?? undefined,
    estSpam: (raw.is_spam as boolean) ?? (raw.estSpam as boolean) ?? false,
    estModer: (raw.estModer as boolean) ?? true,
    dateCreation: (raw.created_at as string) || (raw.dateCreation as string) || new Date().toISOString(),
  };
}

export function mapAvisToAPI(data: {
  texte: string;
  note: number;
  auteurId?: string;
  commerceId: string;
}): Record<string, unknown> {
  return {
    commentaire: data.texte,
    note: data.note,
    commerce_id: data.commerceId,
  };
}

// ─── Utilisateur Mappers ────────────────────────────────────────────────────

export function mapUtilisateurFromAPI(raw: Record<string, unknown>): Utilisateur {
  const role = (raw.role as string) || 'citoyen';

  return {
    id: raw.id as string,
    email: (raw.email as string) || '',
    nom: (raw.nom as string) || '',
    prenom: (raw.prenom as string) || (raw.nom as string) || '',
    telephone: raw.telephone as string | undefined,
    role: role as Utilisateur['role'],
    avatar: raw.avatar as string | undefined,
    estActif: raw.est_actif !== undefined
      ? (raw.est_actif as boolean)
      : role !== null,
    dateCreation: (raw.created_at as string) || (raw.dateCreation as string) || new Date().toISOString(),
  };
}
