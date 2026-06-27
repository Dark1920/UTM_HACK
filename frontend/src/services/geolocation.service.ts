export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeolocationResult {
  coordinates: Coordinates;
  accuracy: number;
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
