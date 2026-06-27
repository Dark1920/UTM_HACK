'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Store,
  BarChart3,
  User,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
  MessageSquare,
  Shield,
  Hammer,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

interface SidebarProps {
  role: 'artisan' | 'admin';
  user?: {
    nom: string;
    prenom: string;
    avatar?: string;
    email: string;
  };
  onLogout?: () => void;
}

export default function Sidebar({ role, user, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const artisanLinks = [
    { href: ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Tableau de bord' },
    { href: ROUTES.DASHBOARD_COMMERCES, icon: Store, label: 'Mes commerces' },
    { href: ROUTES.DASHBOARD_STATISTIQUES, icon: BarChart3, label: 'Statistiques' },
    { href: ROUTES.DASHBOARD_PROFIL, icon: User, label: 'Mon profil' },
  ];

  const adminLinks = [
    { href: ROUTES.ADMIN, icon: LayoutDashboard, label: 'Tableau de bord' },
    { href: ROUTES.ADMIN_UTILISATEURS, icon: Users, label: 'Utilisateurs' },
    { href: ROUTES.ADMIN_COMMERCES, icon: Store, label: 'Commerces' },
    { href: ROUTES.ADMIN_COMMENTAIRES, icon: MessageSquare, label: 'Commentaires' },
    { href: ROUTES.ADMIN_CATEGORIES, icon: Settings, label: 'Catégories' },
    { href: ROUTES.ADMIN_SIGNALEMENTS, icon: Shield, label: 'Signalements' },
  ];

  const links = role === 'admin' ? adminLinks : artisanLinks;

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white/80 backdrop-blur-xl border-r border-stone-200/50 h-[calc(100vh-4.5rem)] sticky top-[4.5rem] transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700 shadow-sm'
                  : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? link.label : undefined}
            >
              <link.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-primary-600' : ''}`} />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-stone-100 p-3">
        {user && (
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.prenom} className="h-10 w-10 rounded-xl object-cover flex-shrink-0 ring-2 ring-stone-100" />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-xs font-bold text-white">
                  {user.prenom[0]}{user.nom[0]}
                </span>
              </div>
            )}
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-900 truncate">{user.prenom} {user.nom}</p>
                <p className="text-xs text-stone-500 truncate">{user.email}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-1 mt-4">
          <button
            onClick={onLogout}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-error-600 hover:bg-error-50 rounded-xl transition-colors flex-1 ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? 'Déconnexion' : undefined}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Déconnexion</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl hidden lg:block transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
}
