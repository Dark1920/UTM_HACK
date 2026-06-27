'use client';

import { mockArtisans, mockCitoyens, mockCommerces, mockCommentaires, mockStatistiques } from '@/lib/mock-data';
import { Users, Store, MessageSquare, Eye, Activity } from 'lucide-react';

export default function AdminDashboardPage() {
  const totalUsers = mockArtisans.length + mockCitoyens.length;
  const totalCommerces = mockCommerces.length;
  const totalReviews = mockCommentaires.length;
  const totalViews = mockCommerces.reduce((sum, c) => sum + c.nombreVues, 0);

  const stats = [
    { label: 'Utilisateurs', value: totalUsers, icon: Users, color: 'from-info-50 to-info-100', iconColor: 'text-info-600', ring: 'ring-info-200/50', change: '+3' },
    { label: 'Commerces', value: totalCommerces, icon: Store, color: 'from-success-50 to-success-100', iconColor: 'text-success-600', ring: 'ring-success-200/50', change: '+5' },
    { label: 'Commentaires', value: totalReviews, icon: MessageSquare, color: 'from-purple-50 to-purple-100', iconColor: 'text-purple-600', ring: 'ring-purple-200/50', change: '+8' },
    { label: 'Vues totales', value: totalViews, icon: Eye, color: 'from-primary-50 to-primary-100', iconColor: 'text-primary-600', ring: 'ring-primary-200/50', change: '+245' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Tableau de bord admin</h1>
        <p className="text-stone-500 text-sm mt-2">Vue d&apos;ensemble de la plateforme</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} ring-1 ${stat.ring}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <span className="text-xs font-semibold text-success-700 bg-success-50 px-2.5 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-stone-900 tracking-tight">{stat.value}</p>
            <p className="text-xs text-stone-500 mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900 mb-5">Activité récente</h2>
          <div className="space-y-3">
            {mockStatistiques.activiteRecente.map((activity, i) => (
              <div key={i} className="flex items-start gap-3.5 p-4 bg-stone-50 rounded-2xl">
                <div className={`p-2 rounded-xl ${
                  activity.type === 'commentaire' ? 'bg-purple-100' : 'bg-success-100'
                }`}>
                  {activity.type === 'commentaire' ? (
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                  ) : (
                    <Users className="h-4 w-4 text-success-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-stone-700 leading-relaxed">{activity.description}</p>
                  <p className="text-xs text-stone-400 mt-1">
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
          <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-900 mb-5">Répartition par catégorie</h2>
            <div className="space-y-4">
              {mockStatistiques.commercesParCategorie.slice(0, 6).map((cat) => (
                <div key={cat.categorie}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-stone-600">{cat.categorie}</span>
                    <span className="text-sm font-semibold text-stone-900">{cat.nombre}</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-primary-400 to-primary-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${(cat.nombre / Math.max(...mockStatistiques.commercesParCategorie.map((c) => c.nombre))) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-900 mb-5">Actions rapides</h2>
            <div className="space-y-3">
              <a
                href="/admin/utilisateurs"
                className="flex items-center gap-3.5 p-4 bg-info-50 hover:bg-info-100 rounded-2xl transition-all duration-200 group"
              >
                <div className="p-2 rounded-xl bg-info-100 group-hover:bg-info-200 transition-colors">
                  <Users className="h-5 w-5 text-info-600" />
                </div>
                <span className="text-sm font-semibold text-info-700">Gérer les utilisateurs</span>
              </a>
              <a
                href="/admin/commerces"
                className="flex items-center gap-3.5 p-4 bg-success-50 hover:bg-success-100 rounded-2xl transition-all duration-200 group"
              >
                <div className="p-2 rounded-xl bg-success-100 group-hover:bg-success-200 transition-colors">
                  <Store className="h-5 w-5 text-success-600" />
                </div>
                <span className="text-sm font-semibold text-success-700">Gérer les commerces</span>
              </a>
              <a
                href="/admin/signalements"
                className="flex items-center gap-3.5 p-4 bg-error-50 hover:bg-error-100 rounded-2xl transition-all duration-200 group"
              >
                <div className="p-2 rounded-xl bg-error-100 group-hover:bg-error-200 transition-colors">
                  <Activity className="h-5 w-5 text-error-600" />
                </div>
                <span className="text-sm font-semibold text-error-700">Voir les signalements</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
