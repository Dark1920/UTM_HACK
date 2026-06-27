import type { Categorie } from '@/types';

export const CATEGORIES: Categorie[] = [
  { id: 'cat-1', nom: 'Mécanicien', slug: 'mecanicien', icone: 'Wrench', description: 'Réparation de motos et véhicules', nombreCommerces: 12 },
  { id: 'cat-2', nom: 'Couturier', slug: 'couturier', icone: 'Scissors', description: 'Confection et retouche de vêtements', nombreCommerces: 8 },
  { id: 'cat-3', nom: 'Menuisier', slug: 'menuisier', icone: 'Hammer', description: 'Travail du bois et menuiserie', nombreCommerces: 6 },
  { id: 'cat-4', nom: 'Soudeur', slug: 'soudeur', icone: 'Flame', description: 'Soudure et métallerie', nombreCommerces: 5 },
  { id: 'cat-5', nom: 'Électricien', slug: 'electricien', icone: 'Zap', description: 'Installation et réparation électrique', nombreCommerces: 9 },
  { id: 'cat-6', nom: 'Plombier', slug: 'plombier', icone: 'Droplets', description: 'Installation et réparation de plomberie', nombreCommerces: 4 },
  { id: 'cat-7', nom: 'Coiffeur', slug: 'coiffeur', icone: 'Scissors', description: 'Coiffure et soins capillaires', nombreCommerces: 15 },
  { id: 'cat-8', nom: 'Réparateur téléphones', slug: 'reparateur-telephones', icone: 'Smartphone', description: 'Réparation de téléphones et tablettes', nombreCommerces: 11 },
  { id: 'cat-9', nom: 'Frigoriste', slug: 'frigoriste', icone: 'Snowflake', description: 'Climatisation et froid', nombreCommerces: 3 },
  { id: 'cat-10', nom: 'Peintre', slug: 'peintre', icone: 'PaintBucket', description: 'Peinture bâtiment et décoration', nombreCommerces: 7 },
];