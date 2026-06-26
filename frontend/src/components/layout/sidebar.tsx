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
      className={`hidden lg:flex flex-col bg-white border-r border-gray-200 h-[calc(100vh-4rem)] sticky top-16 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? link.label : undefined}
            >
              <link.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-amber-600' : ''}`} />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-3">
        {user && (
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.prenom} className="h-9 w-9 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-amber-700">
                  {user.prenom[0]}{user.nom[0]}
                </span>
              </div>
            )}
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.prenom} {user.nom}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-1 mt-3">
          <button
            onClick={onLogout}
            className={`flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-1 ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? 'Déconnexion' : undefined}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Déconnexion</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg hidden lg:block"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
}
