'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Heart, Menu, X, User, LogOut, ChevronDown, AlertTriangle, Hammer } from 'lucide-react';
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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-stone-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          <div className="flex items-center gap-2.5">
            <Link href={ROUTES.HOME} className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-warm group-hover:shadow-lg transition-all duration-300">
                <Hammer className="h-4.5 w-4.5" />
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-bold text-primary-600">Artisans</span>
                <span className="text-xl font-bold text-stone-900">BF</span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-stone-600 hover:text-primary-700 rounded-xl hover:bg-primary-50 transition-all duration-200"
              >
                {link.label}
                {link.urgent && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error-500" />
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Rechercher un artisan, un service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-200 rounded-2xl bg-stone-50 focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={ROUTES.FAVORIS}
              className="p-2.5 text-stone-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-100 transition-all duration-200"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.prenom} className="h-9 w-9 rounded-xl object-cover ring-2 ring-stone-100" />
                  ) : (
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-sm">
                      <span className="text-sm font-bold text-white">
                        {user.prenom[0]}{user.nom[0]}
                      </span>
                    </div>
                  )}
                  <ChevronDown className="h-4 w-4 text-stone-400 hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50 animate-in fade-in-down zoom-in duration-200">
                      <div className="px-4 py-3 border-b border-stone-100">
                        <p className="text-sm font-semibold text-stone-900">{user.prenom} {user.nom}</p>
                        <p className="text-xs text-stone-500 capitalize mt-0.5">{user.role}</p>
                      </div>
                      <div className="p-1.5">
                        <Link
                          href={user.role === 'admin' ? ROUTES.ADMIN : ROUTES.DASHBOARD}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 rounded-xl transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4 text-stone-400" />
                          Tableau de bord
                        </Link>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onLogout?.();
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-error-600 hover:bg-error-50 rounded-xl transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href={ROUTES.CONNEXION}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl shadow-warm hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
              >
                Connexion
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white/95 backdrop-blur-xl animate-in fade-in-down duration-200">
          <div className="px-4 py-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:border-primary-300 outline-none"
              />
            </div>
          </div>
          <nav className="px-3 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-stone-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.urgent && <AlertTriangle className="h-4 w-4 text-error-500" />}
                {link.label}
                {link.urgent && (
                  <span className="flex h-2 w-2 ml-auto">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-error-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-error-500" />
                  </span>
                )}
              </Link>
            ))}
            {!user && (
              <Link
                href={ROUTES.CONNEXION}
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl mt-3"
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
