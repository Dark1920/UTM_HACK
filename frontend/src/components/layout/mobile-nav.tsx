'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, AlertTriangle, Heart, User } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const navItems = [
  { href: ROUTES.HOME, icon: Home, label: 'Accueil' },
  { href: ROUTES.ANNUAIRE, icon: Search, label: 'Annuaire' },
  { href: ROUTES.URGENCE, icon: AlertTriangle, label: 'Urgence', urgent: true },
  { href: ROUTES.FAVORIS, icon: Heart, label: 'Favoris' },
  { href: ROUTES.CONNEXION, icon: User, label: 'Profil' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 relative ${
                isActive
                  ? item.urgent
                    ? 'text-red-600'
                    : 'text-amber-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <item.icon className={`h-5 w-5 ${item.urgent && !isActive ? 'text-red-400' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.urgent && (
                <span className="absolute top-2 right-1/2 translate-x-3 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
              )}
              {isActive && (
                <span className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full ${
                  item.urgent ? 'bg-red-600' : 'bg-amber-600'
                }`} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
