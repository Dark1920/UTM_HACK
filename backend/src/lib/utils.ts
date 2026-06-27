// Utilitaires partagés

/**
 * Formate une date ISO en format lisible
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Génère un slug à partir d'une chaîne
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Utility cn pour merger des classes Tailwind
 * (Alternative légère à clsx + tailwind-merge)
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Valide un numéro de téléphone (format Burkina Faso)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+226|00226)?[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Formate un numéro de téléphone
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 8) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
  }
  return phone;
}

/**
 * Retourne une réponse JSON formatée pour les Server Actions
 */
export function actionResponse<T>(
  success: boolean,
  data?: T,
  error?: string
) {
  return {
    success,
    data,
    error,
    timestamp: new Date().toISOString(),
  };
}
