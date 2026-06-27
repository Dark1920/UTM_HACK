'use client';

import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, MapPin, Phone, MessageCircle, Locate, Loader2 } from 'lucide-react';
import { mockCommerces, mockCategories } from '@/lib/mock-data';

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

export default function UrgencePage() {
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
      setGeo((g) => ({ ...g, error: 'La géolocalisation n\'est pas supportée.' }));
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

  const nearbyCommerces = userLocated
    ? mockCommerces
        .filter((c) => c.estPublic)
        .map((c) => ({
          ...c,
          distance: getDistance(geo.lat, geo.lng, c.latitude, c.longitude),
        }))
        .filter((c) => (activeCategory ? c.categorieId === activeCategory : true))
        .sort((a, b) => a.distance - b.distance)
    : [];

  return (
    <div className="min-h-screen bg-error-50/30">
      {/* Emergency Header */}
      <div className="bg-gradient-to-r from-error-600 to-error-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-5 mb-6">
            <div className="relative">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 sm:h-9 sm:w-9" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-white" />
              </span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">MODE URGENCE</h1>
              <p className="text-white/70 text-sm sm:text-base mt-1">
                Trouvez un artisan près de vous en urgence
              </p>
            </div>
          </div>

          {!userLocated && (
            <button
              onClick={requestLocation}
              disabled={geo.loading}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-error-600 font-semibold rounded-2xl hover:bg-error-50 disabled:opacity-60 transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-[0.98]"
            >
              {geo.loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Locate className="h-5 w-5" />
              )}
              {geo.loading ? 'Localisation en cours...' : 'Activer ma position'}
            </button>
          )}

          {geo.error && (
            <p className="text-white/60 text-sm mt-3">{geo.error}</p>
          )}
        </div>
      </div>

      {/* Category quick filters */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                !activeCategory
                  ? 'bg-error-500 text-white border-error-500 shadow-md'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-error-300'
              }`}
            >
              Tous
            </button>
            {mockCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-error-500 text-white border-error-500 shadow-md'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-error-300'
                }`}
              >
                {cat.nom}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Map area */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl border border-stone-100 h-72 sm:h-96 flex items-center justify-center sticky top-24 shadow-sm">
              <div className="text-center text-stone-400">
                <div className="h-20 w-20 rounded-3xl bg-stone-50 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-10 w-10 text-stone-300" />
                </div>
                <p className="font-semibold text-stone-600">Carte des artisans à proximité</p>
                {userLocated && (
                  <p className="text-sm mt-1">
                    Position: {geo.lat.toFixed(4)}, {geo.lng.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Nearby artisans list */}
          <div className="lg:w-1/2">
            <h2 className="font-semibold text-stone-900 mb-5 text-lg">
              Artisans à proximité ({nearbyCommerces.length})
            </h2>
            {nearbyCommerces.length === 0 ? (
              <div className="text-center py-14 bg-white rounded-2xl border border-stone-100 shadow-sm">
                <div className="h-16 w-16 rounded-2xl bg-stone-50 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-stone-300" />
                </div>
                <p className="text-stone-500 font-medium">Aucun artisan trouvé à proximité.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {nearbyCommerces.map((commerce) => {
                  const category = mockCategories.find((c) => c.id === commerce.categorieId);
                  return (
                    <div
                      key={commerce.id}
                      className="bg-white rounded-2xl border border-stone-100 p-5 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={commerce.photos[0]}
                          alt={commerce.nom}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="font-semibold text-stone-900 truncate">
                              {commerce.nom}
                            </h3>
                            <span className="shrink-0 text-xs font-semibold text-error-600 bg-error-50 px-2.5 py-1 rounded-full">
                              {commerce.distance.toFixed(1)} km
                            </span>
                          </div>
                          <p className="text-sm text-stone-500 mb-2">{category?.nom}</p>
                          <p className="text-xs text-stone-400 mb-3 truncate">{commerce.adresse}</p>
                          <div className="flex gap-2">
                            {commerce.telephone && (
                              <a
                                href={`tel:${commerce.telephone}`}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-info-500 text-white text-xs font-semibold rounded-xl hover:bg-info-600 transition-all duration-200 active:scale-[0.98]"
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
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-success-500 text-white text-xs font-semibold rounded-xl hover:bg-success-600 transition-all duration-200 active:scale-[0.98]"
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
