import { apiFetch } from '@/lib/api-client';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeolocationResult {
  coordinates: Coordinates;
  accuracy: number;
}

export interface GeocodingResult {
  displayName: string;
  latitude: number;
  longitude: number;
}

const OUAGADOUGOU_CENTER: Coordinates = {
  latitude: 12.3714,
  longitude: -1.5197,
};

export const geolocationService = {
  async getCurrentPosition(): Promise<GeolocationResult> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Géolocalisation non supportée'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            coordinates: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error('Autorisation de géolocalisation refusée'));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error('Position non disponible'));
              break;
            case error.TIMEOUT:
              reject(new Error('Délai de géolocalisation dépassé'));
              break;
            default:
              reject(new Error('Erreur de géolocalisation'));
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  },

  async getDefaultCoordinates(): Promise<Coordinates> {
    return OUAGADOUGOU_CENTER;
  },

  // Géocodage (adresse → coordonnées) via le backend /api/geocoding (Nominatim).
  async geocodeAddress(address: string, city?: string): Promise<GeocodingResult | null> {
    try {
      const data = await apiFetch<{ found: boolean; primary?: { display_name: string; latitude: number; longitude: number } }>(
        '/api/geocoding',
        { query: { address, city } }
      );
      if (!data.found || !data.primary) return null;
      return {
        displayName: data.primary.display_name,
        latitude: data.primary.latitude,
        longitude: data.primary.longitude,
      };
    } catch {
      return null;
    }
  },

  // Géocodage inverse (coordonnées → adresse) via le backend /api/geocoding.
  async reverseGeocode(latitude: number, longitude: number): Promise<GeocodingResult | null> {
    try {
      const data = await apiFetch<{ found: boolean; display_name: string; latitude: number; longitude: number }>(
        '/api/geocoding',
        { method: 'POST', body: { latitude, longitude } }
      );
      if (!data.found) return null;
      return {
        displayName: data.display_name,
        latitude: data.latitude,
        longitude: data.longitude,
      };
    } catch {
      return null;
    }
  },

  calculateDistance(from: Coordinates, to: Coordinates): number {
    const R = 6371;
    const dLat = ((to.latitude - from.latitude) * Math.PI) / 180;
    const dLon = ((to.longitude - from.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((from.latitude * Math.PI) / 180) *
        Math.cos((to.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },
};
