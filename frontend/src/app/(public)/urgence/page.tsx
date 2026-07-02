'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Phone, MessageCircle, Locate, Loader2 } from 'lucide-react';
import { CATEGORIES } from '@/constants/categories';
import { commerceService } from '@/services/commerce.service';
import MapLeaflet from '@/components/maps/map-leaflet';
import type { Commerce } from '@/types/commerce';

interface GeolocationState {
  lat: number;
  lng: number;
  loading: boolean;
  error: string | null;
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface CommerceWithDistance extends Commerce {
  distance: number;
}

export default function UrgencePage() {
  const router = useRouter();
  const [commerces, setCommerces] = useState<Commerce[]>([]);
  const [geo, setGeo] = useState<GeolocationState>({
    lat: 0,
    lng: 0,
    loading: false,
    error: null,
  });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [userLocated, setUserLocated] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeo((g) => ({ ...g, error: "La géolocalisation n'est pas supportée." }));
      return;
    }
    setGeo((g) => ({ ...g, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude, loading: false, error: null });
        setUserLocated(true);
      },
      () => {
        setGeo({ lat: 12.3714, lng: -1.5197, loading: false, error: null });
        setUserLocated(true);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  useEffect(() => {
    commerceService.getAll().then(setCommerces).catch(console.error);
  }, []);

  const nearbyCommerces: CommerceWithDistance[] = userLocated
    ? commerces
        .filter((c) => c.estPublic)
        .map((c): CommerceWithDistance => ({
          ...c,
          distance: getDistance(geo.lat, geo.lng, c.latitude, c.longitude),
        }))
        .filter((c) => (activeCategory ? c.categorieId === activeCategory : true))
        .sort((a, b) => a.distance - b.distance)
    : [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-stone-200 bg-error-50/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-error-600" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-error-600">
              Mode urgence
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
            Trouvez l&apos;artisan le plus proche, maintenant.
          </h1>
          <p className="text-stone-500 mt-2 max-w-xl">
            Nous trions automatiquement les artisans disponibles par distance, en fonction de votre position.
          </p>

          {!userLocated && (
            <button
              onClick={requestLocation}
              disabled={geo.loading}
              className="inline-flex items-center gap-2 mt-6 h-11 px-5 bg-error-600 text-white font-medium rounded-md hover:bg-error-700 disabled:opacity-60 transition-colors"
            >
              {geo.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Locate className="h-4 w-4" />}
              {geo.loading ? 'Localisation en cours...' : 'Activer ma position'}
            </button>
          )}
          {geo.error && <p className="text-error-600 text-sm mt-3">{geo.error}</p>}
        </div>
      </div>

      {/* Category quick filters */}
      <div className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`shrink-0 px-3.5 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                !activeCategory
                  ? 'bg-error-600 text-white border-error-600'
                  : 'bg-white text-stone-600 border-stone-300 hover:border-error-400'
              }`}
            >
              Tous
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-error-600 text-white border-error-600'
                    : 'bg-white text-stone-600 border-stone-300 hover:border-error-400'
                }`}
              >
                {cat.nom}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map area */}
          <MapLeaflet
            className="h-72 sm:h-[28rem] w-full lg:sticky lg:top-20"
            center={userLocated ? [geo.lat, geo.lng] : undefined}
            zoom={13}
            userLocation={userLocated ? { latitude: geo.lat, longitude: geo.lng } : null}
            markers={nearbyCommerces.map((c) => ({
              id: c.id,
              position: [c.latitude, c.longitude],
              popup: c.nom,
            }))}
            onMarkerClick={(id) => router.push(`/commerce/${id}`)}
          />

          {/* Nearby artisans list */}
          <div>
            <h2 className="font-semibold text-stone-900 mb-4 text-base">
              Artisans à proximité ({nearbyCommerces.length})
            </h2>
            {nearbyCommerces.length === 0 ? (
              <div className="text-center py-14 border border-dashed border-stone-300 rounded-lg">
                <AlertTriangle className="h-7 w-7 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500 text-sm">Aucun artisan trouvé à proximité.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {nearbyCommerces.map((commerce) => {
                  const category = CATEGORIES.find((c) => c.id === commerce.categorieId);
                  return (
                    <div
                      key={commerce.id}
                      className="rounded-lg border border-stone-200 p-4 hover:border-stone-400 transition-colors"
                    >
                      <div className="flex items-start gap-3.5">
                        <img
                          src={commerce.photos[0]}
                          alt={commerce.nom}
                          className="w-14 h-14 rounded-md object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-stone-900 truncate">{commerce.nom}</h3>
                            <span className="shrink-0 text-xs font-semibold text-error-700 bg-error-50 px-2 py-0.5 rounded-md">
                              {commerce.distance.toFixed(1)} km
                            </span>
                          </div>
                          <p className="text-sm text-stone-500">{category?.nom}</p>
                          <p className="text-xs text-stone-400 mb-2.5 truncate">{commerce.adresse}</p>
                          <div className="flex gap-2">
                            {commerce.telephone && (
                              <a
                                href={`tel:${commerce.telephone}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-info-600 text-white text-xs font-medium rounded-md hover:bg-info-700 transition-colors"
                              >
                                <Phone className="h-3.5 w-3.5" />
                                Appeler
                              </a>
                            )}
                            {commerce.whatsapp && (
                              <a
                                href={`https://wa.me/${commerce.whatsapp.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-success-600 text-white text-xs font-medium rounded-md hover:bg-success-700 transition-colors"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                                WhatsApp
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
