'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Heart, Menu, X, User, LogOut, ChevronDown, AlertTriangle } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const navLinks = [
  { href: ROUTES.HOME, label: 'Accueil' },
  { href: ROUTES.ANNUAIRE, label: 'Annuaire' },
  { href: ROUTES.URGENCE, label: 'Urgence', urgent: true },
];

interface HeaderProps {
  user?: {
    nom: string;
    prenom: string;
    avatar?: string;
    role: string;
  } | null;
  onLogout?: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Link href={ROUTES.HOME} className="flex items-center gap-2">
              <span className="text-xl font-bold text-amber-600">Artisans</span>
              <span className="text-xl font-bold text-gray-900">BF</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 text-sm font-medium text-gray-700 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
              >
                {link.label}
                {link.urgent && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un artisan, un service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-gray-50 focus:bg-white focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={ROUTES.FAVORIS}
              className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.prenom} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-amber-700">
                        {user.prenom[0]}{user.nom[0]}
                      </span>
                    </div>
                  )}
                  <ChevronDown className="h-4 w-4 text-gray-500 hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.prenom} {user.nom}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                      <Link
                        href={user.role === 'admin' ? ROUTES.ADMIN : ROUTES.DASHBOARD}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Tableau de bord
                      </Link>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onLogout?.();
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href={ROUTES.CONNEXION}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
              >
                Connexion
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-amber-300 outline-none"
              />
            </div>
          </div>
          <nav className="px-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.urgent && <AlertTriangle className="h-4 w-4 text-red-500" />}
                {link.label}
                {link.urgent && (
                  <span className="flex h-2 w-2 ml-auto">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                )}
              </Link>
            ))}
            {!user && (
              <Link
                href={ROUTES.CONNEXION}
                className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Connexion
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
