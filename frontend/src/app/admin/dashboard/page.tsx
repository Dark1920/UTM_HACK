'use client';

import { mockArtisans, mockCitoyens, mockCommerces, mockCommentaires, mockStatistiques } from '@/lib/mock-data';
import { Users, Store, MessageSquare, Eye, TrendingUp, Activity } from 'lucide-react';

export default function AdminDashboardPage() {
  const totalUsers = mockArtisans.length + mockCitoyens.length;
  const totalCommerces = mockCommerces.length;
  const totalReviews = mockCommentaires.length;
  const totalViews = mockCommerces.reduce((sum, c) => sum + c.nombreVues, 0);

  const stats = [
    { label: 'Utilisateurs', value: totalUsers, icon: Users, color: 'bg-blue-100 text-blue-600', change: '+3' },
    { label: 'Commerces', value: totalCommerces, icon: Store, color: 'bg-green-100 text-green-600', change: '+5' },
    { label: 'Commentaires', value: totalReviews, icon: MessageSquare, color: 'bg-purple-100 text-purple-600', change: '+8' },
    { label: 'Vues totales', value: totalViews, icon: Eye, color: 'bg-amber-100 text-amber-600', change: '+245' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord admin</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d&apos;ensemble de la plateforme</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h2>
          <div className="space-y-4">
            {mockStatistiques.activiteRecente.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-1.5 rounded-lg ${
                  activity.type === 'commentaire' ? 'bg-purple-100' : 'bg-green-100'
                }`}>
                  {activity.type === 'commentaire' ? (
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                  ) : (
                    <Users className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(activity.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Répartition par catégorie</h2>
            <div className="space-y-3">
              {mockStatistiques.commercesParCategorie.slice(0, 6).map((cat) => (
                <div key={cat.categorie}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{cat.categorie}</span>
                    <span className="text-sm font-medium text-gray-900">{cat.nombre}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{ width: `${(cat.nombre / Math.max(...mockStatistiques.commercesParCategorie.map((c) => c.nombre))) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
            <div className="space-y-3">
              <a
                href="/admin/utilisateurs"
                className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Gérer les utilisateurs</span>
              </a>
              <a
                href="/admin/commerces"
                className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <Store className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">Gérer les commerces</span>
              </a>
              <a
                href="/admin/signalements"
                className="flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Activity className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-700">Voir les signalements</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
