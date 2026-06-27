'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Star, MapPin, Phone, Users, Building, StarHalf, Hammer } from 'lucide-react';
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
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0zMHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 mb-8 border border-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              Le bon artisan près de chez vous
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
              Trouvez votre artisan de proximité
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-12 max-w-xl mx-auto leading-relaxed">
              Le premier annuaire intelligent des artisans du Burkina Faso.
              Mécaniciens, couturiers, électriciens et bien plus.
            </p>

            <div className="max-w-xl mx-auto mb-10">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Rechercher un artisan, un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 text-stone-900 rounded-2xl shadow-2xl text-lg focus:ring-4 focus:ring-white/30 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={ROUTES.ANNUAIRE}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-primary-700 font-semibold rounded-2xl hover:bg-primary-50 transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-[0.98]"
              >
                Voir l&apos;annuaire
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href={ROUTES.URGENCE}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-error-500 text-white font-semibold rounded-2xl hover:bg-error-600 transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-[0.98]"
              >
                Mode urgence
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">1000+</p>
              <p className="text-sm text-stone-500 mt-1">artisans</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-secondary-50 to-secondary-100 flex items-center justify-center">
                  <Building className="h-6 w-6 text-secondary-600" />
                </div>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">5</p>
              <p className="text-sm text-stone-500 mt-1">villes</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100 flex items-center justify-center">
                  <StarHalf className="h-6 w-6 text-accent-600" />
                </div>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">4.5</p>
              <p className="text-sm text-stone-500 mt-1">note moyenne</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-stone-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-3">
              Catégories populaires
            </h2>
            <p className="text-stone-500 max-w-lg mx-auto">
              Explorez nos spécialités et trouvez l&apos;expert qu&apos;il vous faut
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mockCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`${ROUTES.ANNUAIRE}?categorie=${cat.id}`}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-lg hover:border-primary-200 border border-stone-100 transition-all duration-300 group hover:-translate-y-0.5"
              >
                <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">{categoryIcons[cat.id] || '🔧'}</span>
                <h3 className="font-semibold text-stone-900 group-hover:text-primary-600 transition-colors text-sm">
                  {cat.nom}
                </h3>
                <p className="text-xs text-stone-400 mt-1.5">{cat.nombreCommerces} artisans</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-3">
              Comment ça marche ?
            </h2>
            <p className="text-stone-500 max-w-lg mx-auto">
              En 3 étapes simples, trouvez l&apos;artisan idéal près de chez vous.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((step) => (
              <div key={step.num} className="text-center group">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center mx-auto mb-6 relative group-hover:shadow-lg group-hover:shadow-primary-100 transition-all duration-300">
                  <step.icon className="h-8 w-8 text-primary-600" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-primary-200">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">{step.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured commerces */}
      <section className="bg-stone-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                Artisans en vedette
              </h2>
              <p className="text-stone-500 mt-2">Les mieux notés par la communauté</p>
            </div>
            <Link
              href={ROUTES.ANNUAIRE}
              className="hidden sm:inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              Voir tous <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCommerces.map((commerce) => (
              <Link
                key={commerce.id}
                href={ROUTES.COMMERCE(commerce.id)}
                className="bg-white rounded-2xl overflow-hidden border border-stone-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="relative h-52 bg-stone-100 overflow-hidden">
                  <img
                    src={commerce.photos[0]}
                    alt={commerce.nom}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-xs font-medium text-stone-700 px-3 py-1.5 rounded-full shadow-sm">
                      {mockCategories.find((c) => c.id === commerce.categorieId)?.nom}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-stone-900 group-hover:text-primary-600 transition-colors text-lg">
                    {commerce.nom}
                  </h3>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-4 w-4 fill-primary-400 text-primary-400" />
                    <span className="text-sm font-medium text-stone-700">{commerce.note}</span>
                    <span className="text-sm text-stone-400">({commerce.nombreAvis} avis)</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2.5 text-sm text-stone-500">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{commerce.ville}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="sm:hidden mt-8 text-center">
            <Link
              href={ROUTES.ANNUAIRE}
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
            >
              Voir tous les artisans <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-8">
            <Hammer className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Vous êtes artisan ?
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Rejoignez ArtisansBF et exposez votre savoir-faire à des milliers de clients potentiels. Inscription gratuite et rapide.
          </p>
          <Link
            href={ROUTES.INSCRIPTION}
            className="inline-flex items-center gap-2.5 px-10 py-4 bg-white text-primary-700 font-semibold rounded-2xl hover:bg-primary-50 transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-[0.98]"
          >
            Rejoignez-nous
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
