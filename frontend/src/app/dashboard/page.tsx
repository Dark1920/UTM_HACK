'use client';

import { useAuthStore } from '@/stores/auth.store';
import { mockCommerces, mockCommentaires } from '@/lib/mock-data';
import { Store, Phone, Eye, Star, Plus, BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { StatCard } from '@/components/shared/stat-card';

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
    { label: 'Vues', value: totalVues, icon: <Eye className="h-[18px] w-[18px]" />, variant: 'blue' as const },
    { label: 'Appels', value: totalAppels, icon: <Phone className="h-[18px] w-[18px]" />, variant: 'green' as const },
    { label: 'Clics WhatsApp', value: totalClics, icon: <Store className="h-[18px] w-[18px]" />, variant: 'purple' as const },
    { label: 'Note moyenne', value: avgNote, icon: <Star className="h-[18px] w-[18px]" />, variant: 'amber' as const },
  ];

  const quickActions = [
    { href: ROUTES.DASHBOARD_COMMERCES, icon: Plus, label: 'Ajouter un commerce' },
    { href: ROUTES.DASHBOARD_STATISTIQUES, icon: BarChart3, label: 'Voir les statistiques' },
    { href: ROUTES.DASHBOARD_PROFIL, icon: Star, label: 'Modifier mon profil' },
  ];

  const recentReviews = mockCommentaires
    .filter((c) => userCommerces.some((uc) => uc.id === c.commerceId))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">
          Bonjour, {user?.prenom}
        </h1>
        <p className="text-stone-500 text-sm mt-1.5">Voici un aperçu de votre activité</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} icon={stat.icon} value={stat.value} label={stat.label} variant={stat.variant} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-lg border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold text-stone-900 mb-5">Aperçu des vues</h2>
          <div className="h-56 flex items-center justify-center rounded-md border border-dashed border-stone-300">
            <div className="text-center text-stone-400">
              <BarChart3 className="h-7 w-7 mx-auto mb-2" />
              <p className="text-sm">Graphique des vues (placeholder)</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold text-stone-900 mb-4">Actions rapides</h2>
          <div className="space-y-1">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 p-2.5 rounded-md hover:bg-stone-50 transition-colors group"
              >
                <action.icon className="h-4 w-4 text-stone-400" />
                <span className="text-sm font-medium text-stone-700 flex-1">{action.label}</span>
                <ArrowRight className="h-3.5 w-3.5 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-6">
        <h2 className="text-base font-semibold text-stone-900 mb-4">Avis récents</h2>
        {recentReviews.length === 0 ? (
          <div className="text-center py-10">
            <Star className="h-7 w-7 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-400 text-sm">Aucun avis pour le moment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentReviews.map((review) => (
              <div key={review.id} className="flex items-start gap-3 p-3.5 rounded-md border border-stone-200">
                <div className="h-9 w-9 rounded-md bg-stone-900 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-white">
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
                            i < review.note ? 'fill-primary-600 text-primary-600' : 'text-stone-300'
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
