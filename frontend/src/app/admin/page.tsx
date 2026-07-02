'use client';

import { useState, useEffect } from 'react';
import { Users, Store, MessageSquare, Eye, Activity, ArrowRight } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';
import { adminService, type AdminStats } from '@/services/admin.service';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">Tableau de bord admin</h1>
          <p className="text-stone-500 text-sm mt-1.5">Vue d&apos;ensemble de la plateforme</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-stone-100" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Utilisateurs', value: stats?.total_utilisateurs ?? 0, icon: <Users className="h-[18px] w-[18px]" />, variant: 'blue' as const, change: 3 },
    { label: 'Commerces', value: stats?.total_commerces ?? 0, icon: <Store className="h-[18px] w-[18px]" />, variant: 'green' as const, change: 5 },
    { label: 'Commentaires', value: stats?.total_avis ?? 0, icon: <MessageSquare className="h-[18px] w-[18px]" />, variant: 'purple' as const, change: 8 },
    { label: 'Vues totales', value: stats?.total_vues ?? 0, icon: <Eye className="h-[18px] w-[18px]" />, variant: 'amber' as const, change: 245 },
  ];

  const quickActions = [
    { href: '/admin/utilisateurs', icon: Users, label: 'Gérer les utilisateurs' },
    { href: '/admin/commerces', icon: Store, label: 'Gérer les commerces' },
    { href: '/admin/signalements', icon: Activity, label: 'Voir les signalements' },
  ];

  const activiteRecente = stats?.activite_recente || [];
  const repartitionCategories = stats?.repartition_categories || [];
  const maxCommerces = Math.max(...repartitionCategories.map((c) => c.nombre_commerces), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">Tableau de bord admin</h1>
        <p className="text-stone-500 text-sm mt-1.5">Vue d&apos;ensemble de la plateforme</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            variant={stat.variant}
            trend={{ value: stat.change, direction: 'up' }}
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-lg border border-stone-200 p-6">
          <h2 className="text-base font-semibold text-stone-900 mb-4">Activité récente</h2>
          <div className="space-y-2.5">
            {activiteRecente.length === 0 && (
              <p className="text-sm text-stone-400 text-center py-4">Aucune activité récente</p>
            )}
            {activiteRecente.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-md border border-stone-200">
                <div className="p-1.5 rounded-md border border-stone-200">
                  {activity.type === 'nouvel_avis' || activity.type === 'commentaire' ? (
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
          <div className="rounded-lg border border-stone-200 p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-4">Répartition par catégorie</h2>
            <div className="space-y-3.5">
              {repartitionCategories.length === 0 && (
                <p className="text-sm text-stone-400 text-center py-4">Aucune donnée</p>
              )}
              {repartitionCategories.slice(0, 6).map((cat) => (
                <div key={cat.nom}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-stone-600">{cat.nom}</span>
                    <span className="text-sm font-medium text-stone-900">{cat.nombre_commerces}</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-1.5">
                    <div
                      className="bg-primary-600 h-1.5 rounded-full"
                      style={{ width: `${(cat.nombre_commerces / maxCommerces) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-3">Actions rapides</h2>
            <div className="space-y-1">
              {quickActions.map((action) => (
                <a
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-2.5 rounded-md hover:bg-stone-50 transition-colors group"
                >
                  <action.icon className="h-4 w-4 text-stone-400" />
                  <span className="text-sm font-medium text-stone-700 flex-1">{action.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
