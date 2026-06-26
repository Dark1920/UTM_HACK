'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Star, MapPin, Phone, Users, Building, StarHalf } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { mockCommerces, mockCategories } from '@/lib/mock-data';

const categoryIcons: Record<string, string> = {
  'cat-1': '🔧',
  'cat-2': '✂️',
  'cat-3': '🪚',
  'cat-4': '🔥',
  'cat-5': '⚡',
  'cat-6': '🚿',
  'cat-7': '💇',
  'cat-8': '📱',
  'cat-9': '❄️',
  'cat-10': '🎨',
};

const steps = [
  {
    num: '1',
    title: 'Recherchez',
    desc: 'Trouvez l\'artisan qu\'il vous faut parmi notre annuaire complet.',
    icon: Search,
  },
  {
    num: '2',
    title: 'Contactez',
    desc: 'Appelez ou envoyez un WhatsApp directement depuis l\'application.',
    icon: Phone,
  },
  {
    num: '3',
    title: 'Évaluez',
    desc: 'Partagez votre expérience et aidez les autres à faire leur choix.',
    icon: Star,
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const featuredCommerces = mockCommerces.slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0zMHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Trouvez votre artisan de proximité
            </h1>
            <p className="text-lg sm:text-xl text-amber-100 mb-10 max-w-xl mx-auto">
              Le premier annuaire intelligent des artisans du Burkina Faso.
              Mécaniciens, couturiers, électriciens et bien plus.
            </p>

            <div className="max-w-xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un artisan, un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-2xl shadow-xl text-lg focus:ring-4 focus:ring-white/30 outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={ROUTES.ANNUAIRE}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl hover:bg-amber-50 transition-colors shadow-xl"
              >
                Voir l&apos;annuaire
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href={ROUTES.URGENCE}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors shadow-xl"
              >
                Mode urgence
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-amber-500" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900">1000+</p>
              <p className="text-sm text-gray-500 mt-1">artisans</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <Building className="h-8 w-8 text-amber-500" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900">5</p>
              <p className="text-sm text-gray-500 mt-1">villes</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <StarHalf className="h-8 w-8 text-amber-500" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900">4.5</p>
              <p className="text-sm text-gray-500 mt-1">note moyenne</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
            Catégories populaires
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mockCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`${ROUTES.ANNUAIRE}?categorie=${cat.id}`}
                className="bg-white rounded-xl p-5 text-center hover:shadow-lg hover:border-amber-300 border border-gray-100 transition-all group"
              >
                <span className="text-3xl block mb-2">{categoryIcons[cat.id] || '🔧'}</span>
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors text-sm">
                  {cat.nom}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{cat.nombreCommerces} artisans</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-lg mx-auto">
            En 3 étapes simples, trouvez l&apos;artisan idéal près de chez vous.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4 relative">
                  <step.icon className="h-7 w-7 text-amber-600" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured commerces */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Artisans en vedette
              </h2>
              <p className="text-gray-500 mt-1">Les mieux notés par la communauté</p>
            </div>
            <Link
              href={ROUTES.ANNUAIRE}
              className="hidden sm:inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
            >
              Voir tous <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCommerces.map((commerce) => (
              <Link
                key={commerce.id}
                href={ROUTES.COMMERCE(commerce.id)}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group"
              >
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={commerce.photos[0]}
                    alt={commerce.nom}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 px-2.5 py-1 rounded-full">
                      {mockCategories.find((c) => c.id === commerce.categorieId)?.nom}
                    </span>
                  </div>
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
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{commerce.ville}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="sm:hidden mt-6 text-center">
            <Link
              href={ROUTES.ANNUAIRE}
              className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
            >
              Voir tous les artisans <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-amber-600 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Vous êtes artisan ?
          </h2>
          <p className="text-amber-100 text-lg mb-8 max-w-xl mx-auto">
            Rejoignez ArtisansBF et exposez votre savoir-faire à des milliers de clients potentiels. Inscription gratuite et rapide.
          </p>
          <Link
            href={ROUTES.INSCRIPTION}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl hover:bg-amber-50 transition-colors shadow-xl"
          >
            Rejoignez-nous
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
