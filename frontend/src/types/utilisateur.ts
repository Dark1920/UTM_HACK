import type { UserRole } from './auth';

export interface Utilisateur {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone?: string;
  role: UserRole;
  avatar?: string;
  estActif: boolean;
  dateCreation: string;
}