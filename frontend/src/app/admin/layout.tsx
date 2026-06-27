'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Hammer } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES } from '@/constants/routes';
import Sidebar from '@/components/layout/sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push(ROUTES.CONNEXION);
      return;
    }
    if (user.role !== 'admin') {
      router.push(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    router.push(ROUTES.HOME);
  };

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-stone-200/50 h-18 flex items-center px-4 lg:px-6">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2.5 text-stone-600 hover:bg-stone-100 rounded-xl mr-3 transition-colors"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
            <Hammer className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold text-primary-600">Artisans</span>
          <span className="text-lg font-bold text-stone-900">BF</span>
          <span className="ml-2 px-2.5 py-0.5 bg-error-100 text-error-700 text-xs font-semibold rounded-full">
            Admin
          </span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-error-400 to-error-600 flex items-center justify-center shadow-sm">
              <span className="text-sm font-bold text-white">
                {user.prenom[0]}{user.nom[0]}
              </span>
            </div>
            <span className="text-sm font-medium text-stone-700">{user.prenom}</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-stone-900/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className={`fixed inset-y-0 left-0 z-40 lg:hidden transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="h-full">
            <Sidebar role="admin" user={user} onLogout={handleLogout} />
          </div>
        </div>

        <div className="hidden lg:block">
          <Sidebar role="admin" user={user} onLogout={handleLogout} />
        </div>

        <main className="flex-1 min-h-[calc(100vh-4.5rem)] p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
