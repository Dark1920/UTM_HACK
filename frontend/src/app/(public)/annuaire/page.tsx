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
      className="bg-white rounded-2xl overflow-hidden border border-stone-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
    >
      <div className="relative h-48 bg-stone-100 overflow-hidden">
        <img
          src={commerce.photos[0]}
          alt={commerce.nom}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-stone-700 px-3 py-1.5 rounded-full shadow-sm">
          {category?.nom}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-stone-900 group-hover:text-primary-600 transition-colors">
          {commerce.nom}
        </h3>
        <div className="flex items-center gap-1 mt-2">
          <Star className="h-4 w-4 fill-primary-400 text-primary-400" />
          <span className="text-sm font-medium text-stone-700">{commerce.note}</span>
          <span className="text-sm text-stone-400">({commerce.nombreAvis} avis)</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2.5 text-sm text-stone-500">
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
    <div className="bg-stone-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-6 tracking-tight">
            Annuaire des artisans
          </h1>

          {/* Search */}
          <div className="relative max-w-xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Rechercher un artisan, un service, une ville..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-5 py-4 border border-stone-200 rounded-2xl bg-stone-50 focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none transition-all duration-200"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category chips */}
        <div className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-hide mb-6">
          <button
            onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
            className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${
              !selectedCategory
                ? 'bg-primary-500 text-white border-primary-500 shadow-warm'
                : 'bg-white text-stone-600 border-stone-200 hover:border-primary-300 hover:text-primary-600'
            }`}
          >
            Toutes
          </button>
          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
              className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-primary-500 text-white border-primary-500 shadow-warm'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {cat.nom}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-stone-500">
            <span className="font-semibold text-stone-900">{filtered.length}</span> résultat{filtered.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 hover:border-stone-300 transition-all duration-200"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtres
            </button>
            <button
              onClick={() => setShowMap(!showMap)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 hover:border-stone-300 transition-all duration-200"
            >
              <MapPin className="h-4 w-4" />
              {showMap ? 'Masquer la carte' : 'Afficher la carte'}
            </button>
          </div>
        </div>

        {/* Filter sidebar */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-8 shadow-sm animate-in fade-in-down duration-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-stone-900">Filtres</h3>
              <button onClick={() => setShowFilters(false)} className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                <X className="h-4 w-4 text-stone-400" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">Ville</label>
                <div className="flex flex-wrap gap-2">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => { setSelectedCity(city); setCurrentPage(1); }}
                      className={`px-3.5 py-2 text-sm rounded-xl border transition-all duration-200 ${
                        selectedCity === city
                          ? 'bg-primary-500 text-white border-primary-500 shadow-warm'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-primary-300'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">Note minimum</label>
                <div className="flex flex-wrap gap-2">
                  {ratings.map((r) => (
                    <button
                      key={r}
                      onClick={() => { setMinRating(r); setCurrentPage(1); }}
                      className={`px-3.5 py-2 text-sm rounded-xl border transition-all duration-200 ${
                        minRating === r
                          ? 'bg-primary-500 text-white border-primary-500 shadow-warm'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-primary-300'
                      }`}
                    >
                      {r === 0 ? 'Toutes' : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">Distance</label>
                <p className="text-sm text-stone-400">Bientôt disponible</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-6">
          {/* Results */}
          <div className={`flex-1 ${showMap ? 'hidden lg:block lg:w-1/2' : ''}`}>
            {paginated.length === 0 ? (
              <div className="text-center py-20">
                <div className="h-24 w-24 rounded-3xl bg-stone-100 flex items-center justify-center mx-auto mb-6">
                  <MapPin className="h-10 w-10 text-stone-300" />
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">Aucun résultat</h3>
                <p className="text-stone-500">Essayez de modifier vos critères de recherche.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((commerce) => (
                  <CommerceCard key={commerce.id} commerce={commerce} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-primary-500 text-white shadow-warm'
                        : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Map sidebar */}
          {showMap && (
            <div className="hidden lg:block lg:w-1/2">
              <div className="bg-white rounded-2xl border border-stone-100 h-[600px] flex items-center justify-center sticky top-24 shadow-sm">
                <div className="text-center text-stone-400">
                  <div className="h-20 w-20 rounded-3xl bg-stone-50 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-10 w-10 text-stone-300" />
                  </div>
                  <p className="font-semibold text-stone-600">Carte interactive</p>
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
