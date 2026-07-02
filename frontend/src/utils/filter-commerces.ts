import type { Commerce } from '@/types/commerce';
import type { TriOption } from '@/types/common';

export interface CommerceFilterOptions {
  /** Texte libre : matche nom / description / ville / adresse. */
  recherche?: string;
  categorieId?: string | null;
  /** Nom de ville exact (insensible à la casse). `null`/`'Toutes'` = pas de filtre. */
  ville?: string | null;
  noteMin?: number;
  /** N'inclure que les commerces publics (défaut : true). */
  onlyPublic?: boolean;
}

/**
 * Filtre pur et unique, partagé par l'annuaire, le hook de recherche et le store.
 * (Évite les 3 implémentations divergentes qui existaient auparavant.)
 */
export function filterCommerces(
  commerces: Commerce[],
  opts: CommerceFilterOptions = {}
): Commerce[] {
  const { recherche, categorieId, ville, noteMin, onlyPublic = true } = opts;
  const q = recherche?.trim().toLowerCase();
  const villeFiltre = ville && ville !== 'Toutes' ? ville.toLowerCase() : null;

  return commerces.filter((c) => {
    if (onlyPublic && !c.estPublic) return false;
    if (q) {
      const match =
        c.nom.toLowerCase().includes(q) ||
        (c.description?.toLowerCase().includes(q) ?? false) ||
        c.ville.toLowerCase().includes(q) ||
        (c.adresse?.toLowerCase().includes(q) ?? false);
      if (!match) return false;
    }
    if (categorieId && c.categorieId !== categorieId) return false;
    if (villeFiltre && c.ville.toLowerCase() !== villeFiltre) return false;
    if (noteMin && c.note < noteMin) return false;
    return true;
  });
}

/** Tri pur partagé. `distance`/`relevance` conservent l'ordre reçu. */
export function sortCommerces(commerces: Commerce[], tri: TriOption): Commerce[] {
  const result = [...commerces];
  switch (tri) {
    case 'note':
      result.sort((a, b) => b.note - a.note);
      break;
    case 'date':
      result.sort(
        (a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
      );
      break;
    default:
      break;
  }
  return result;
}
