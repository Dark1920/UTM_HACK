import L from 'leaflet';

export function createMap(center: [number, number] = [12.3714, -1.5197], zoom: number = 12) {
  if (typeof window === 'undefined') return null;
  return L.map('map', { center, zoom, zoomControl: false });
}

export function addMarker(map: L.Map, position: [number, number], popup: string) {
  return L.marker(position).addTo(map).bindPopup(popup);
}

export const BURKINA_FASO_CENTER: [number, number] = [12.3714, -1.5197];
export const OUAGADOUGOU_CENTER: [number, number] = [12.3714, -1.5197];
export const DEFAULT_ZOOM = 12;
