'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Phone, MessageCircle, Locate, Loader2 } from 'lucide-react';
import { rechercheService, geolocationService } from '@/services';
import type { CommerceProche } from '@/services/recherche.service';
import { categorieService } from '@/services/categorie.service';
import type { Categorie } from '@/types/commerce';
import MapLeaflet from '@/components/maps/map-leaflet';

interface GeolocationState {
  lat: number;
  lng: number;
  loading: boolean;
  error: string | null;
}

// Rayon large : on veut tous les commerces triés par distance (comportement "urgence").
const RAYON_METRES = 1_000_000;

export default function UrgencePage() {
  const router = useRouter();
  const [geo, setGeo] = useState<GeolocationState>({
    lat: 0,
    lng: 0,
    loading: false,
    error: null,
  });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [userLocated, setUserLocated] = useState(false);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [nearbyCommerces, setNearbyCommerces] = useState<CommerceProche[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [adresse, setAdresse] = useState<string | null>(null);

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

  // Catégories réelles (backend /api/categories)
  useEffect(() => {
    categorieService.getAll().then(setCategories).catch(() => setCategories([]));
  }, []);

  // Recherche géolocalisée serveur (backend /api/recherche) à chaque changement de position/catégorie
  useEffect(() => {
    if (!userLocated) return;
    let annule = false;
    setLoadingResults(true);
    rechercheService
      .rechercher({
        categorieId: activeCategory ?? undefined,
        latitude: geo.lat,
        longitude: geo.lng,
        rayon: RAYON_METRES,
      })
      .then((res) => {
        if (!annule) setNearbyCommerces(res);
      })
      .catch(() => {
        if (!annule) setNearbyCommerces([]);
      })
      .finally(() => {
        if (!annule) setLoadingResults(false);
      });
    return () => {
      annule = true;
    };
  }, [userLocated, activeCategory, geo.lat, geo.lng]);

  // Adresse détectée (géocodage inverse backend /api/geocoding)
  useEffect(() => {
    if (!userLocated) return;
    let annule = false;
    geolocationService.reverseGeocode(geo.lat, geo.lng).then((r) => {
      if (!annule && r) setAdresse(r.displayName);
    });
    return () => {
      annule = true;
    };
  }, [userLocated, geo.lat, geo.lng]);

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

          {adresse && (
            <p className="text-stone-600 text-sm mt-3">
              📍 Votre position&nbsp;: <span className="font-medium">{adresse}</span>
            </p>
          )}

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
            {categories.map((cat) => (
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
            <h2 className="font-semibold text-stone-900 mb-4 text-base flex items-center gap-2">
              Artisans à proximité ({nearbyCommerces.length})
              {loadingResults && <Loader2 className="h-4 w-4 animate-spin text-stone-400" />}
            </h2>
            {nearbyCommerces.length === 0 ? (
              <div className="text-center py-14 border border-dashed border-stone-300 rounded-lg">
                <AlertTriangle className="h-7 w-7 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500 text-sm">Aucun artisan trouvé à proximité.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {nearbyCommerces.map((commerce) => {
                  const category = categories.find((c) => c.id === commerce.categorieId);
                  return (
                    <div
                      key={commerce.id}
                      className="rounded-lg border border-stone-200 p-4 hover:border-stone-400 transition-colors"
                    >
                      <div className="flex items-start gap-3.5">
                        <img
                          src={commerce.photos[0] || 'https://placehold.co/56x56/e7e5e4/78716c?text=%20'}
                          alt={commerce.nom}
                          className="w-14 h-14 rounded-md object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-stone-900 truncate">{commerce.nom}</h3>
                            {commerce.distance != null && (
                              <span className="shrink-0 text-xs font-semibold text-error-700 bg-error-50 px-2 py-0.5 rounded-md">
                                {commerce.distance.toFixed(1)} km
                              </span>
                            )}
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
