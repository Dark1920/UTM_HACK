'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:px-6">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg mr-3"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-amber-600">Artisans</span>
          <span className="text-lg font-bold text-gray-900">BF</span>
          <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            Admin
          </span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-sm font-medium text-red-700">
                {user.prenom[0]}{user.nom[0]}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700">{user.prenom}</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
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

        <main className="flex-1 min-h-[calc(100vh-4rem)] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
