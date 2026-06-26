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
    { label: 'Vues', value: totalVues, icon: Eye, color: 'bg-blue-100 text-blue-600' },
    { label: 'Appels', value: totalAppels, icon: Phone, color: 'bg-green-100 text-green-600' },
    { label: 'Clics WhatsApp', value: totalClics, icon: Store, color: 'bg-purple-100 text-purple-600' },
    { label: 'Note moyenne', value: avgNote, icon: Star, color: 'bg-amber-100 text-amber-600' },
  ];

  const recentReviews = mockCommentaires
    .filter((c) => userCommerces.some((uc) => uc.id === c.commerceId))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {user?.prenom} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Voici un aperçu de votre activité
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aperçu des vues</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Graphique des vues (placeholder)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div className="space-y-3">
            <Link
              href={ROUTES.DASHBOARD_COMMERCES}
              className="flex items-center gap-3 p-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">Ajouter un commerce</span>
            </Link>
            <Link
              href={ROUTES.DASHBOARD_STATISTIQUES}
              className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Voir les statistiques</span>
            </Link>
            <Link
              href={ROUTES.DASHBOARD_PROFIL}
              className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Star className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Modifier mon profil</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Avis récents</h2>
        {recentReviews.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Aucun avis pour le moment</p>
        ) : (
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div key={review.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-amber-700">
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
                            i < review.note ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.dateCreation).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{review.texte}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
