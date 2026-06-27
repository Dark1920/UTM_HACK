'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Menu, X, User, LogOut, ChevronDown, AlertTriangle } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const navLinks = [
  { href: ROUTES.HOME, label: 'Accueil' },
  { href: ROUTES.ANNUAIRE, label: 'Annuaire' },
  { href: ROUTES.URGENCE, label: "J'ai une urgence", urgent: true },
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

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-stone-900 text-white text-sm font-bold">
              A
            </span>
            <span className="text-[15px] font-semibold text-stone-900 tracking-tight">
              ArtisansBF
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors ${
                  link.urgent ? 'text-error-600 hover:text-error-700' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.FAVORIS}
              className="hidden sm:flex p-2 text-stone-400 hover:text-stone-900 transition-colors"
              aria-label="Favoris"
            >
              <Heart className="h-[18px] w-[18px]" />
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 hover:bg-stone-100 transition-colors"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.prenom} className="h-7 w-7 rounded-md object-cover" />
                  ) : (
                    <div className="h-7 w-7 rounded-md bg-stone-900 flex items-center justify-center">
                      <span className="text-xs font-semibold text-white">
                        {user.prenom[0]}{user.nom[0]}
                      </span>
                    </div>
                  )}
                  <ChevronDown className="h-3.5 w-3.5 text-stone-400 hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md border border-stone-200 py-1.5 z-50 animate-in fade-in duration-150">
                      <div className="px-3.5 py-2.5 border-b border-stone-200">
                        <p className="text-sm font-medium text-stone-900">{user.prenom} {user.nom}</p>
                        <p className="text-xs text-stone-500 capitalize mt-0.5">{user.role}</p>
                      </div>
                      <div className="p-1">
                        <Link
                          href={user.role === 'admin' ? ROUTES.ADMIN : ROUTES.DASHBOARD}
                          className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-sm transition-colors"
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
                          className="flex items-center gap-2.5 w-full px-2.5 py-2 text-sm text-error-600 hover:bg-error-50 rounded-sm transition-colors"
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
                className="hidden sm:inline-flex items-center h-9 px-4 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors"
              >
                Connexion
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white animate-in fade-in duration-150">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2.5 px-2 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.urgent && <AlertTriangle className="h-4 w-4 text-error-500" />}
                {link.label}
              </Link>
            ))}
            <Link
              href={ROUTES.FAVORIS}
              className="flex items-center gap-2.5 px-2 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart className="h-4 w-4" />
              Favoris
            </Link>
            {!user && (
              <Link
                href={ROUTES.CONNEXION}
                className="flex items-center justify-center w-full h-10 text-sm font-medium text-white bg-stone-900 rounded-md mt-2"
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
