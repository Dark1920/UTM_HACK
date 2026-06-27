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
    <div className="rounded-lg border border-stone-200 overflow-hidden group hover:border-stone-400 transition-colors">
      <Link href={ROUTES.COMMERCE(commerce.id)}>
        <div className="relative h-40 bg-stone-100">
          <img src={commerce.photos[0]} alt={commerce.nom} className="w-full h-full object-cover" />
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">{category?.nom}</p>
        <div className="flex items-start justify-between mt-1 gap-2">
          <Link href={ROUTES.COMMERCE(commerce.id)} className="min-w-0">
            <h3 className="font-medium text-stone-900 group-hover:underline truncate">{commerce.nom}</h3>
          </Link>
          <button
            onClick={() => onRemove(commerce.id)}
            className="p-1.5 text-stone-400 hover:text-error-500 rounded-md transition-colors shrink-0"
            title="Retirer des favoris"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-1 mt-1.5">
          <Star className="h-4 w-4 fill-primary-600 text-primary-600" />
          <span className="text-sm font-medium text-stone-700">{commerce.note}</span>
          <span className="text-sm text-stone-400">({commerce.nombreAvis} avis)</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-sm text-stone-500">
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
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-stone-900 tracking-tight mb-8">Mes favoris</h1>

        {favoriteCommerces.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-stone-300 rounded-lg">
            <Heart className="h-10 w-10 text-stone-300 mx-auto mb-4" />
            <h2 className="text-base font-semibold text-stone-900 mb-1.5">Aucun favori pour le moment</h2>
            <p className="text-stone-500 mb-6 max-w-sm mx-auto text-sm">
              Parcourez l&apos;annuaire et ajoutez vos artisans préférés pour les retrouver facilement.
            </p>
            <Link
              href={ROUTES.ANNUAIRE}
              className="inline-flex items-center gap-2 h-10 px-5 bg-stone-900 text-white font-medium rounded-md hover:bg-stone-800 transition-colors"
            >
              Voir l&apos;annuaire
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favoriteCommerces.map((commerce) => (
              <FavoriteCard key={commerce.id} commerce={commerce} onRemove={removeFavorite} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
