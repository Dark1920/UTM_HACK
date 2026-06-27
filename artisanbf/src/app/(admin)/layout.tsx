// Layout admin protégé
// @ts-nocheck
import { getCurrentUser } from '@/actions/auth.actions';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || (user as any).profil?.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div>
      <nav>
        <h2>Administration</h2>
        <a href="/admin/utilisateurs">Utilisateurs</a>
        <a href="/admin/commerces">Commerces</a>
        <a href="/admin/avis">Avis</a>
        <a href="/admin/categories">Catégories</a>
        <a href="/admin/signalements">Signalements</a>
      </nav>
      {children}
    </div>
  );
}
