'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { mockCommerces, mockCommentaires } from '@/lib/mock-data';
import { Eye, Phone, MessageSquare, Star, BarChart3, Calendar } from 'lucide-react';

export default function StatistiquesPage() {
  const { user } = useAuthStore();
  const userCommerces = mockCommerces.filter((c) => c.artisanId === user?.id);
  const userReviews = mockCommentaires.filter((r) =>
    userCommerces.some((c) => c.id === r.commerceId)
  );

  const [dateRange, setDateRange] = useState('7j');

  const totalVues = userCommerces.reduce((sum, c) => sum + c.nombreVues, 0);
  const totalAppels = userCommerces.reduce((sum, c) => sum + c.nombreAppels, 0);
  const totalClics = userCommerces.reduce((sum, c) => sum + c.nombreClicsWhatsApp, 0);
  const avgNote = userCommerces.length
    ? (userCommerces.reduce((sum, c) => sum + c.note, 0) / userCommerces.length).toFixed(1)
    : '0';

  const topCommerce = [...userCommerces].sort((a, b) => b.nombreVues - a.nombreVues)[0];

  const stats = [
    { label: 'Vues totales', value: totalVues, icon: Eye, color: 'bg-blue-100 text-blue-600', change: '+12%' },
    { label: 'Appels reçus', value: totalAppels, icon: Phone, color: 'bg-green-100 text-green-600', change: '+8%' },
    { label: 'Clics WhatsApp', value: totalClics, icon: MessageSquare, color: 'bg-purple-100 text-purple-600', change: '+15%' },
    { label: 'Note moyenne', value: avgNote, icon: Star, color: 'bg-amber-100 text-amber-600', change: '+0.2' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
          <p className="text-gray-500 text-sm mt-1">Suivez les performances de vos commerces</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          >
            <option value="7j">7 derniers jours</option>
            <option value="30j">30 derniers jours</option>
            <option value="90j">90 derniers jours</option>
            <option value="1an">Cette année</option>
          </select>
        </div>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Évolution des vues</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Graphique en barres (placeholder)</p>
              <p className="text-xs text-gray-300 mt-1">Données simulées pour {dateRange}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Commerce le plus performant</h2>
            {topCommerce ? (
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                  <Star className="h-8 w-8 text-amber-600" />
                </div>
                <p className="font-medium text-gray-900">{topCommerce.nombreVues} vues</p>
                <p className="text-sm text-gray-500 mt-1">{topCommerce.nom}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium">{topCommerce.note.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({topCommerce.nombreAvis} avis)</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">Aucun commerce</p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Résumé des avis</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total avis</span>
                <span className="font-medium text-gray-900">{userReviews.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Note moyenne</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-gray-900">{avgNote}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avis 5 étoiles</span>
                <span className="font-medium text-gray-900">
                  {userReviews.filter((r) => r.note === 5).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avis 4 étoiles</span>
                <span className="font-medium text-gray-900">
                  {userReviews.filter((r) => r.note === 4).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
