import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formaterDate(date: string): string {
  return format(parseISO(date), 'dd MMM yyyy', { locale: fr });
}

export function formaterDateRelative(date: string): string {
  return formatDistanceToNow(parseISO(date), { addSuffix: true, locale: fr });
}

export function formaterTelephone(tel: string): string {
  const cleaned = tel.replace(/\D/g, '');
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6)}`;
  }
  return tel;
}

export function formaterNote(note: number): string {
  return note.toFixed(1);
}

export function tronquer(texte: string, longueur: number): string {
  if (texte.length <= longueur) return texte;
  return texte.slice(0, longueur) + '...';
}
