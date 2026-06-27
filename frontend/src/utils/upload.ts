export function validerFichier(file: File, maxSizeMB: number = 5): { valide: boolean; erreur?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { valide: false, erreur: 'Format de fichier non supporté. Utilisez JPEG, PNG ou WebP.' };
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valide: false, erreur: `Fichier trop volumineux. Maximum ${maxSizeMB}Mo.` };
  }
  return { valide: true };
}

export function genererUrlTemporaire(file: File): string {
  return URL.createObjectURL(file);
}
