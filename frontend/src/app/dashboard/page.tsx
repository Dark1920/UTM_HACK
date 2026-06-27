'use client';

import { useAuthStore } from '@/stores/auth.store';
import { mockCommerces, mockCommentaires } from '@/lib/mock-data';
import { Store, Phone, Eye, Star, Plus, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const userCommerces = mockCommerces.filter((c) => c.artisanId === user?.id).slice(0, 3);
  const totalVues = userCommerces.reduce((sum, c) => sum + c.nombreVues, 0);
  const totalAppels = userCommerces.reduce((sum, c) => sum + c.nombreAppels, 0);
  const totalClics = userCommerces.reduce((sum, c) => sum + c.nombreClicsWhatsApp, 0);
  const avgNote = userCommerces.length
    ? (userCommerces.reduce((sum, c) => sum + c.note, 0) / userCommerces.length).toFixed(1)
    : '0';

  const stats = [
    { label: 'Vues', value: totalVues, icon: Eye, color: 'from-info-50 to-info-100', iconColor: 'text-info-600', ring: 'ring-info-200/50' },
    { label: 'Appels', value: totalAppels, icon: Phone, color: 'from-success-50 to-success-100', iconColor: 'text-success-600', ring: 'ring-success-200/50' },
    { label: 'Clics WhatsApp', value: totalClics, icon: Store, color: 'from-purple-50 to-purple-100', iconColor: 'text-purple-600', ring: 'ring-purple-200/50' },
    { label: 'Note moyenne', value: avgNote, icon: Star, color: 'from-primary-50 to-primary-100', iconColor: 'text-primary-600', ring: 'ring-primary-200/50' },
  ];

  const recentReviews = mockCommentaires
    .filter((c) => userCommerces.some((uc) => uc.id === c.commerceId))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
          Bonjour, {user?.prenom}
        </h1>
        <p className="text-stone-500 text-sm mt-2">
          Voici un aperçu de votre activité
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} ring-1 ${stat.ring}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-900 tracking-tight">{stat.value}</p>
                <p className="text-xs text-stone-500 font-medium">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900 mb-5">Aperçu des vues</h2>
          <div className="h-64 flex items-center justify-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-8 w-8 text-stone-300" />
              </div>
              <p className="text-sm text-stone-400 font-medium">Graphique des vues (placeholder)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900 mb-5">Actions rapides</h2>
          <div className="space-y-3">
            <Link
              href={ROUTES.DASHBOARD_COMMERCES}
              className="flex items-center gap-3.5 p-4 bg-primary-50 hover:bg-primary-100 rounded-2xl transition-all duration-200 group"
            >
              <div className="p-2 rounded-xl bg-primary-100 group-hover:bg-primary-200 transition-colors">
                <Plus className="h-5 w-5 text-primary-600" />
              </div>
              <span className="text-sm font-semibold text-primary-700">Ajouter un commerce</span>
            </Link>
            <Link
              href={ROUTES.DASHBOARD_STATISTIQUES}
              className="flex items-center gap-3.5 p-4 bg-info-50 hover:bg-info-100 rounded-2xl transition-all duration-200 group"
            >
              <div className="p-2 rounded-xl bg-info-100 group-hover:bg-info-200 transition-colors">
                <BarChart3 className="h-5 w-5 text-info-600" />
              </div>
              <span className="text-sm font-semibold text-info-700">Voir les statistiques</span>
            </Link>
            <Link
              href={ROUTES.DASHBOARD_PROFIL}
              className="flex items-center gap-3.5 p-4 bg-stone-50 hover:bg-stone-100 rounded-2xl transition-all duration-200 group"
            >
              <div className="p-2 rounded-xl bg-stone-100 group-hover:bg-stone-200 transition-colors">
                <Star className="h-5 w-5 text-stone-600" />
              </div>
              <span className="text-sm font-semibold text-stone-700">Modifier mon profil</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900 mb-5">Avis récents</h2>
        {recentReviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-2xl bg-stone-50 flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-stone-300" />
            </div>
            <p className="text-stone-400 text-sm font-medium">Aucun avis pour le moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div key={review.id} className="flex items-start gap-3.5 p-4 bg-stone-50 rounded-2xl">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-xs font-bold text-white">
                    {review.auteurId.slice(-2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < review.note ? 'fill-primary-400 text-primary-400' : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-stone-400">
                      {new Date(review.dateCreation).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-sm text-stone-700 mt-1.5 leading-relaxed">{review.texte}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
