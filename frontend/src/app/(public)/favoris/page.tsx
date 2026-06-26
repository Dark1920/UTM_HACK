'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Star, MapPin, Trash2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { mockCommerces, mockCategories } from '@/lib/mock-data';
import type { Commerce } from '@/types/commerce';

function FavoriteCard({
  commerce,
  onRemove,
}: {
  commerce: Commerce;
  onRemove: (id: string) => void;
}) {
  const category = mockCategories.find((c) => c.id === commerce.categorieId);
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
      <Link href={ROUTES.COMMERCE(commerce.id)}>
        <div className="relative h-44 bg-gray-100">
          <img
            src={commerce.photos[0]}
            alt={commerce.nom}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 px-2.5 py-1 rounded-full">
            {category?.nom}
          </span>
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <Link href={ROUTES.COMMERCE(commerce.id)} className="min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors truncate">
              {commerce.nom}
            </h3>
          </Link>
          <button
            onClick={() => onRemove(commerce.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 ml-2"
            title="Retirer des favoris"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-1 mt-1.5">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium text-gray-700">{commerce.note}</span>
          <span className="text-sm text-gray-400">({commerce.nombreAvis} avis)</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{commerce.ville}</span>
        </div>
      </div>
    </div>
  );
}

export default function FavorisPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      setFavoriteIds(JSON.parse(stored));
    } else {
      setFavoriteIds(['com-1', 'com-2', 'com-7']);
    }
    setLoaded(true);
  }, []);

  const removeFavorite = (id: string) => {
    const next = favoriteIds.filter((fid) => fid !== id);
    setFavoriteIds(next);
    localStorage.setItem('favorites', JSON.stringify(next));
  };

  const favoriteCommerces = mockCommerces.filter((c) => favoriteIds.includes(c.id));

  if (!loaded) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Mes favoris</h1>

        {favoriteCommerces.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun favori pour le moment
            </h2>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Parcourez l&apos;annuaire et ajoutez vos artisans préférés pour les retrouver facilement.
            </p>
            <Link
              href={ROUTES.ANNUAIRE}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors"
            >
              Voir l&apos;annuaire
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteCommerces.map((commerce) => (
              <FavoriteCard
                key={commerce.id}
                commerce={commerce}
                onRemove={removeFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
