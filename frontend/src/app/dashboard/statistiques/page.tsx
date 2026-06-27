'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { mockCommerces, mockCommentaires } from '@/lib/mock-data';
import { Eye, Phone, MessageSquare, Star, BarChart3, Calendar } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

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
    { label: 'Vues totales', value: totalVues, icon: <Eye className="h-[18px] w-[18px]" />, variant: 'blue' as const, change: '+12%' },
    { label: 'Appels reçus', value: totalAppels, icon: <Phone className="h-[18px] w-[18px]" />, variant: 'green' as const, change: '+8%' },
    { label: 'Clics WhatsApp', value: totalClics, icon: <MessageSquare className="h-[18px] w-[18px]" />, variant: 'purple' as const, change: '+15%' },
    { label: 'Note moyenne', value: avgNote, icon: <Star className="h-[18px] w-[18px]" />, variant: 'amber' as const, change: '+0.2' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">Statistiques</h1>
          <p className="text-stone-500 text-sm mt-1.5">Suivez les performances de vos commerces</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-stone-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="h-9 px-3 border border-stone-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
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
          <StatCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            variant={stat.variant}
            trend={{ value: parseFloat(stat.change), direction: 'up' }}
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-lg border border-stone-200 p-6">
          <h2 className="text-base font-semibold text-stone-900 mb-4">Évolution des vues</h2>
          <div className="h-56 flex items-center justify-center rounded-md border border-dashed border-stone-300">
            <div className="text-center text-stone-400">
              <BarChart3 className="h-7 w-7 mx-auto mb-2" />
              <p className="text-sm">Graphique en barres (placeholder)</p>
              <p className="text-xs mt-1">Données simulées pour {dateRange}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-stone-200 p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-4">Commerce le plus performant</h2>
            {topCommerce ? (
              <div className="text-center">
                <div className="h-12 w-12 rounded-full border border-primary-200 bg-primary-50 flex items-center justify-center mx-auto mb-3">
                  <Star className="h-5 w-5 text-primary-600" />
                </div>
                <p className="font-medium text-stone-900">{topCommerce.nombreVues} vues</p>
                <p className="text-sm text-stone-500 mt-1">{topCommerce.nom}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="h-3.5 w-3.5 fill-primary-600 text-primary-600" />
                  <span className="text-sm font-medium text-stone-800">{topCommerce.note.toFixed(1)}</span>
                  <span className="text-xs text-stone-400">({topCommerce.nombreAvis} avis)</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-stone-400 text-center py-4">Aucun commerce</p>
            )}
          </div>

          <div className="rounded-lg border border-stone-200 p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-4">Résumé des avis</h2>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600">Total avis</span>
                <span className="font-medium text-stone-900">{userReviews.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600">Note moyenne</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-primary-600 text-primary-600" />
                  <span className="font-medium text-stone-900">{avgNote}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600">Avis 5 étoiles</span>
                <span className="font-medium text-stone-900">
                  {userReviews.filter((r) => r.note === 5).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600">Avis 4 étoiles</span>
                <span className="font-medium text-stone-900">
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
