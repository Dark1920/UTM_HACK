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
    await new Promise(r => setTimeout(r, 500));
    return {
      coordinates: {
        latitude: OUAGADOUGOU_CENTER.latitude + (Math.random() - 0.5) * 0.02,
        longitude: OUAGADOUGOU_CENTER.longitude + (Math.random() - 0.5) * 0.02,
      },
      accuracy: Math.floor(Math.random() * 50) + 10,
    };
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
