// Helpers pour les requêtes géospatiales avec PostGIS

/**
 * Convertit des coordonnées en objet geography Point pour PostGIS
 */
export function createGeographyPoint(latitude: number, longitude: number): string {
  return `POINT(${longitude} ${latitude})`;
}

/**
 * Extrait la latitude et longitude d'un geography Point
 */
export function parseGeographyPoint(geography: string): { latitude: number; longitude: number } | null {
  if (!geography) return null;
  
  const match = geography.match(/POINT\(([-\d.]+)\s([-\d.]+)\)/);
  if (!match) return null;
  
  return {
    longitude: parseFloat(match[1]),
    latitude: parseFloat(match[2]),
  };
}

/**
 * Calcule la distance approximative entre deux points (formule haversine simplifiée)
 * Utile pour le tri côté client
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Rayon de la Terre en mètres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance en mètres
}

/**
 * Formate la distance pour l'affichage
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}
