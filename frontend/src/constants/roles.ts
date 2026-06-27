export const ROLES = {
  CITOYEN: 'citoyen',
  ARTISAN: 'artisan',
  ADMIN: 'admin',
} as const;

export const ROLE_LABELS: Record<string, string> = {
  citoyen: 'Citoyen',
  artisan: 'Artisan',
  admin: 'Administrateur',
};