'use client';

import { useState, useEffect } from 'react';
import { adminService, type AdminStats } from '@/services/admin.service';
import { Users, Store, MessageSquare, Eye, Activity, ArrowRight, Loader2 } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        { label: 'Utilisateurs', value: stats.totalUtilisateurs, icon: <Users className="h-[18px] w-[18px]" />, variant: 'blue' as const },
        { label: 'Commerces', value: stats.totalCommerces, icon: <Store className="h-[18px] w-[18px]" />, variant: 'green' as const },
        { label: 'Commentaires', value: stats.totalCommentaires, icon: <MessageSquare className="h-[18px] w-[18px]" />, variant: 'purple' as const },
        { label: 'Vues totales', value: stats.totalVues, icon: <Eye className="h-[18px] w-[18px]" />, variant: 'amber' as const },
      ]
    : [];

  const quickActions = [
    { href: '/admin/utilisateurs', icon: Users, label: 'Gérer les utilisateurs' },
    { href: '/admin/commerces', icon: Store, label: 'Gérer les commerces' },
    { href: '/admin/signalements', icon: Activity, label: 'Voir les signalements' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
      </div>
    );
  }

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
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-lg border border-stone-200 p-6">
          <h2 className="text-base font-semibold text-stone-900 mb-4">Activité récente</h2>
          <div className="text-center py-10">
            <Activity className="h-7 w-7 text-stone-300 mx-auto mb-2" />
            <p className="text-stone-400 text-sm">Les activités récentes apparaîtront ici.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-stone-200 p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-4">Résumé</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600">Utilisateurs actifs</span>
                <span className="text-sm font-medium text-stone-900">{stats?.utilisateursActifs ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600">Commerces en attente</span>
                <span className="text-sm font-medium text-stone-900">{stats?.commercesEnAttente ?? 0}</span>
              </div>
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
