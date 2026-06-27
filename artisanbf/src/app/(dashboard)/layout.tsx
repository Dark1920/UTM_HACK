// Layout protégé pour le dashboard
// @ts-nocheck
import { getCurrentUser } from '@/actions/auth.actions';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/connexion');
  }

  return (
    <div>
      <nav>
        <p>Connecté: {(user as any).profil?.nom}</p>
        <a href="/dashboard">Dashboard</a>
        <a href="/dashboard/mes-commerces">Mes commerces</a>
        <a href="/dashboard/profil">Profil</a>
      </nav>
      {children}
    </div>
  );
}
