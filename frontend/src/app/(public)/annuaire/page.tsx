'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Star, Phone, ChevronLeft, ChevronRight, Map as MapIcon, List } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { mockCommerces, mockCategories } from '@/lib/mock-data';
import { CommercePhoto } from '@/components/commerces/commerce-photo';
import MapLeaflet from '@/components/maps/map-leaflet';
import type { Commerce } from '@/types/commerce';

const cities = ['Toutes', 'Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Banfora', 'Ouahigouya'];
const ratings = [0, 3, 3.5, 4, 4.5];
const ITEMS_PER_PAGE = 9;

function ResultCard({ commerce }: { commerce: Commerce }) {
  const category = mockCategories.find((c) => c.id === commerce.categorieId);
  return (
    <Link
      href={ROUTES.COMMERCE(commerce.id)}
      className="group rounded-lg border border-stone-200 overflow-hidden hover:border-stone-400 transition-colors"
    >
      <div className="relative h-40 bg-stone-100 overflow-hidden">
        <CommercePhoto
          categorieId={commerce.categorieId}
          fallbackSrc={commerce.photos[0]}
          alt={commerce.nom}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">{category?.nom}</p>
        <div className="flex items-center justify-between mt-1 gap-2">
          <h3 className="font-medium text-stone-900 group-hover:underline truncate">{commerce.nom}</h3>
          <span className="flex items-center gap-1 text-sm font-medium text-stone-700 shrink-0">
            <Star className="h-3.5 w-3.5 fill-primary-600 text-primary-600" />
            {commerce.note}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-sm text-stone-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{commerce.adresse}</span>
        </div>
        {commerce.telephone && (
          <div className="flex items-center gap-1.5 mt-1.5 text-sm text-stone-500">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span>{commerce.telephone}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function AnnuairePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState('Toutes');
  const [minRating, setMinRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMap, setShowMap] = useState(false);

  const filtered = useMemo(() => {
    return mockCommerces.filter((c) => {
      if (!c.estPublic) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !c.nom.toLowerCase().includes(q) &&
          !c.description.toLowerCase().includes(q) &&
          !c.ville.toLowerCase().includes(q)
        ) return false;
      }
      if (selectedCategory && c.categorieId !== selectedCategory) return false;
      if (selectedCity !== 'Toutes' && c.ville !== selectedCity) return false;
      if (c.note < minRating) return false;
      return true;
    });
  }, [searchQuery, selectedCategory, selectedCity, minRating]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen">
      <div className="border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-semibold text-stone-900 tracking-tight mb-5">
            Annuaire des artisans
          </h1>
          <div className="relative max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Rechercher un artisan, un service, une ville..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full h-11 pl-10 pr-4 text-sm border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[220px_1fr] gap-8">
          {/* Filter rail */}
          <aside className="space-y-7 lg:sticky lg:top-20 lg:self-start">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-3">Catégorie</h3>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
                  className={`text-left px-2.5 py-1.5 rounded-md text-sm transition-colors ${
                    !selectedCategory ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  Toutes
                </button>
                {mockCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                    className={`text-left px-2.5 py-1.5 rounded-md text-sm transition-colors flex items-center justify-between ${
                      selectedCategory === cat.id ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {cat.nom}
                    <span className={selectedCategory === cat.id ? 'text-stone-300' : 'text-stone-400'}>
                      {cat.nombreCommerces}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-3">Ville</h3>
              <div className="flex flex-wrap gap-1.5">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => { setSelectedCity(city); setCurrentPage(1); }}
                    className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                      selectedCity === city
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-600 border-stone-300 hover:border-stone-900'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-3">Note minimum</h3>
              <div className="flex flex-wrap gap-1.5">
                {ratings.map((r) => (
                  <button
                    key={r}
                    onClick={() => { setMinRating(r); setCurrentPage(1); }}
                    className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                      minRating === r
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-600 border-stone-300 hover:border-stone-900'
                    }`}
                  >
                    {r === 0 ? 'Toutes' : `${r}+`}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-stone-500">
                <span className="font-medium text-stone-900">{filtered.length}</span> résultat{filtered.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-1 border border-stone-300 rounded-md p-0.5">
                <button
                  onClick={() => setShowMap(false)}
                  className={`p-1.5 rounded-sm transition-colors ${!showMap ? 'bg-stone-900 text-white' : 'text-stone-500'}`}
                  aria-label="Liste"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowMap(true)}
                  className={`p-1.5 rounded-sm transition-colors ${showMap ? 'bg-stone-900 text-white' : 'text-stone-500'}`}
                  aria-label="Carte"
                >
                  <MapIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {showMap ? (
              <MapLeaflet
                className="h-[560px] w-full"
                markers={filtered.map((c) => ({
                  id: c.id,
                  position: [c.latitude, c.longitude],
                  popup: c.nom,
                }))}
                onMarkerClick={(id) => router.push(ROUTES.COMMERCE(id))}
              />
            ) : paginated.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-stone-300 rounded-lg">
                <MapPin className="h-8 w-8 text-stone-300 mx-auto mb-4" />
                <h3 className="text-base font-semibold text-stone-900 mb-1">Aucun résultat</h3>
                <p className="text-sm text-stone-500">Essayez de modifier vos critères de recherche.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginated.map((commerce) => (
                  <ResultCard key={commerce.id} commerce={commerce} />
                ))}
              </div>
            )}

            {!showMap && totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-10">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-9 w-9 flex items-center justify-center rounded-md border border-stone-300 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 w-9 rounded-md text-sm font-medium transition-colors ${
                      currentPage === page ? 'bg-stone-900 text-white' : 'border border-stone-300 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-9 w-9 flex items-center justify-center rounded-md border border-stone-300 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
