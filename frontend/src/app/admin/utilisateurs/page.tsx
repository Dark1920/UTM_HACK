'use client';

import { useState } from 'react';
import { mockArtisans, mockCitoyens } from '@/lib/mock-data';
import { Search, Trash2, UserCheck, UserX } from 'lucide-react';
import type { Utilisateur } from '@/types/utilisateur';

const allUsers: Utilisateur[] = [...mockArtisans, ...mockCitoyens];

export default function UtilisateursPage() {
  const [users, setUsers] = useState(allUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.nom.toLowerCase().includes(search.toLowerCase()) ||
      u.prenom.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleActive = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, estActif: !u.estActif } : u))
    );
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Utilisateurs</h1>
        <p className="text-stone-500 text-sm mt-2">{filteredUsers.length} utilisateur(s)</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 outline-none transition-all duration-200 hover:border-stone-300"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-3 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 outline-none transition-all duration-200 hover:border-stone-300"
        >
          <option value="all">Tous les rôles</option>
          <option value="citoyen">Citoyen</option>
          <option value="artisan">Artisan</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50/50 border-b border-stone-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">Utilisateur</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">Rôle</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden md:table-cell">Statut</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden lg:table-cell">Inscrit le</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.prenom} className="h-9 w-9 rounded-xl object-cover ring-2 ring-stone-100" />
                      ) : (
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-sm">
                          <span className="text-xs font-bold text-white">
                            {user.prenom[0]}{user.nom[0]}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-stone-900">{user.prenom} {user.nom}</p>
                        <p className="text-xs text-stone-500 sm:hidden">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="text-sm text-stone-600">{user.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin'
                        ? 'bg-error-100 text-error-700'
                        : user.role === 'artisan'
                        ? 'bg-info-100 text-info-700'
                        : 'bg-stone-100 text-stone-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                      user.estActif ? 'text-success-600' : 'text-stone-400'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${user.estActif ? 'bg-success-500' : 'bg-stone-400'}`} />
                      {user.estActif ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-sm text-stone-500">
                      {new Date(user.dateCreation).toLocaleDateString('fr-FR')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleActive(user.id)}
                        className={`p-2 rounded-xl transition-all duration-200 ${
                          user.estActif
                            ? 'text-stone-400 hover:text-primary-600 hover:bg-primary-50'
                            : 'text-stone-400 hover:text-success-600 hover:bg-success-50'
                        }`}
                        title={user.estActif ? 'Désactiver' : 'Activer'}
                      >
                        {user.estActif ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-2 text-stone-400 hover:text-error-600 hover:bg-error-50 rounded-xl transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-400 text-sm font-medium">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
