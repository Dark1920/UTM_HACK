"use client";

import { useEffect, useRef } from "react";
import { OUAGADOUGOU_CENTER, DEFAULT_ZOOM } from "@/lib/leaflet";

interface MapMarker {
  id: string;
  position: [number, number];
  popup?: string;
}

interface MapContentLoaderProps {
  markers?: MapMarker[];
  userLocation?: { latitude: number; longitude: number } | null;
  onMarkerClick?: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function MapContentLoader({
  markers = [],
  userLocation,
  onMarkerClick,
  center = OUAGADOUGOU_CENTER,
  zoom = DEFAULT_ZOOM,
}: MapContentLoaderProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center,
        zoom,
        zoomControl: false,
      });

      L.control.zoom({ position: "topright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    });

    return () => {
      cancelled = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    import("leaflet").then((L) => {
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      const bounds: L.LatLngExpression[] = [];

      markers.forEach((marker) => {
        const m = L.marker(marker.position).addTo(map);
        if (marker.popup) {
          m.bindPopup(marker.popup);
        }
        m.on("click", () => onMarkerClick?.(marker.id));
        bounds.push(marker.position);
      });

      if (userLocation) {
        const userIcon = L.divIcon({
          className: "",
          html: '<div class="h-4 w-4 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
          .addTo(map)
          .bindPopup("Votre position");
        bounds.push([userLocation.latitude, userLocation.longitude]);
      }

      if (bounds.length > 0) {
        map.fitBounds(bounds as L.LatLngTuple[], { padding: [40, 40], maxZoom: 15 });
      }
    });
  }, [markers, userLocation, onMarkerClick]);

  return <div ref={mapRef} className="h-full w-full" />;
}
