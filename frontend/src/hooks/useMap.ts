'use client';

import { useRef, useCallback } from 'react';

interface MarkerOptions {
  lat: number;
  lng: number;
  title?: string;
}

export function useMap() {
  const mapRef = useRef<unknown>(null);

  const initMap = useCallback(
    (containerId: string, center: { lat: number; lng: number }, zoom = 13) => {
      if (typeof window === 'undefined') return null;
      try {
        const L = require('leaflet');
        const container = document.getElementById(containerId);
        if (!container) return null;

        const map = L.map(container).setView([center.lat, center.lng], zoom);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        mapRef.current = map;
        return map;
      } catch {
        return null;
      }
    },
    []
  );

  const setCenter = useCallback(
    (lat: number, lng: number, zoom?: number) => {
      if (!mapRef.current) return;
      try {
        const map = mapRef.current as { setView: Function };
        map.setView([lat, lng], zoom);
      } catch {}
    },
    []
  );

  const addMarker = useCallback((options: MarkerOptions) => {
    if (!mapRef.current) return null;
    try {
      const L = require('leaflet');
      const map = mapRef.current as { addLayer: Function };
      const marker = L.marker([options.lat, options.lng]);
      if (options.title) {
        marker.bindPopup(options.title);
      }
      marker.addTo(map);
      return marker;
    } catch {
      return null;
    }
  }, []);

  const fitBounds = useCallback(
    (bounds: Array<{ lat: number; lng: number }>) => {
      if (!mapRef.current || bounds.length === 0) return;
      try {
        const L = require('leaflet');
        const map = mapRef.current as { fitBounds: Function };
        const latLngs = bounds.map((b) => [b.lat, b.lng]);
        map.fitBounds(latLngs, { padding: [50, 50] });
      } catch {}
    },
    []
  );

  return { initMap, setCenter, addMarker, fitBounds, mapInstance: mapRef };
}
