'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, MapPin, Star, Phone, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { mockCommerces, mockCategories } from '@/lib/mock-data';
import type { Commerce } from '@/types/commerce';

const cities = ['Toutes', 'Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Banfora', 'Ouahigouya'];
const ratings = [0, 3, 3.5, 4, 4.5];
const ITEMS_PER_PAGE = 9;

function CommerceCard({ commerce }: { commerce: Commerce }) {
  const category = mockCategories.find((c) => c.id === commerce.categorieId);
  return (
    <Link
      href={ROUTES.COMMERCE(commerce.id)}
      className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group"
    >
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
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
          {commerce.nom}
        </h3>
        <div className="flex items-center gap-1 mt-1.5">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium text-gray-700">{commerce.note}</span>
          <span className="text-sm text-gray-400">({commerce.nombreAvis} avis)</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{commerce.adresse}</span>
        </div>
        {commerce.telephone && (
          <div className="flex items-center gap-1.5 mt-1.5 text-sm text-gray-500">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span>{commerce.telephone}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function AnnuairePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState('Toutes');
  const [minRating, setMinRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Annuaire des artisans
          </h1>

          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un artisan, un service, une ville..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-4">
          <button
            onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              !selectedCategory
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
            }`}
          >
            Toutes
          </button>
          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
              }`}
            >
              {cat.nom}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-900">{filtered.length}</span> résultat{filtered.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtres
            </button>
            <button
              onClick={() => setShowMap(!showMap)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <MapPin className="h-4 w-4" />
              {showMap ? 'Masquer la carte' : 'Afficher la carte'}
            </button>
          </div>
        </div>

        {/* Filter sidebar */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filtres</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                <div className="flex flex-wrap gap-2">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => { setSelectedCity(city); setCurrentPage(1); }}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        selectedCity === city
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Note minimum</label>
                <div className="flex flex-wrap gap-2">
                  {ratings.map((r) => (
                    <button
                      key={r}
                      onClick={() => { setMinRating(r); setCurrentPage(1); }}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        minRating === r
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      {r === 0 ? 'Toutes' : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
                <p className="text-sm text-gray-400">Bientôt disponible</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-6">
          {/* Results */}
          <div className={`flex-1 ${showMap ? 'hidden lg:block lg:w-1/2' : ''}`}>
            {paginated.length === 0 ? (
              <div className="text-center py-16">
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat</h3>
                <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginated.map((commerce) => (
                  <CommerceCard key={commerce.id} commerce={commerce} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium ${
                      currentPage === page
                        ? 'bg-amber-500 text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Map sidebar */}
          {showMap && (
            <div className="hidden lg:block lg:w-1/2">
              <div className="bg-white rounded-xl border border-gray-200 h-[600px] flex items-center justify-center sticky top-24">
                <div className="text-center text-gray-400">
                  <MapPin className="h-12 w-12 mx-auto mb-3" />
                  <p className="font-medium">Carte interactive</p>
                  <p className="text-sm mt-1">Intégration Leaflet bientôt disponible</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
