'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AlertTriangle, MapPin, Phone, MessageCircle, Locate, Loader2, X } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
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
        setGeo((g) => ({
          ...g,
          loading: false,
          error: 'Impossible d\'obtenir votre position. Utilisation de Ouagadougou par défaut.',
        }));
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
    <div className="min-h-screen bg-red-50">
      {/* Emergency Header */}
      <div className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-white" />
              </span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">MODE URGENCE</h1>
              <p className="text-red-200 text-sm sm:text-base mt-1">
                Trouvez un artisan près de vous en urgence
              </p>
            </div>
          </div>

          {!userLocated && (
            <button
              onClick={requestLocation}
              disabled={geo.loading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 font-semibold rounded-xl hover:bg-red-50 disabled:opacity-60 transition-colors"
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
            <p className="text-red-200 text-sm mt-3">{geo.error}</p>
          )}
        </div>
      </div>

      {/* Category quick filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                !activeCategory
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
              }`}
            >
              Tous
            </button>
            {mockCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
                }`}
              >
                {cat.nom}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map area */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-xl border border-gray-200 h-72 sm:h-96 flex items-center justify-center sticky top-24">
              <div className="text-center text-gray-400">
                <MapPin className="h-12 w-12 mx-auto mb-3" />
                <p className="font-medium">Carte des artisans à proximité</p>
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
            <h2 className="font-semibold text-gray-900 mb-4">
              Artisans à proximité ({nearbyCommerces.length})
            </h2>
            {nearbyCommerces.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <AlertTriangle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucun artisan trouvé à proximité.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {nearbyCommerces.map((commerce) => {
                  const category = mockCategories.find((c) => c.id === commerce.categorieId);
                  return (
                    <div
                      key={commerce.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={commerce.photos[0]}
                          alt={commerce.nom}
                          className="w-16 h-16 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {commerce.nom}
                            </h3>
                            <span className="shrink-0 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                              {commerce.distance.toFixed(1)} km
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{category?.nom}</p>
                          <p className="text-xs text-gray-400 mb-3 truncate">{commerce.adresse}</p>
                          <div className="flex gap-2">
                            {commerce.telephone && (
                              <a
                                href={`tel:${commerce.telephone}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors"
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
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors"
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
