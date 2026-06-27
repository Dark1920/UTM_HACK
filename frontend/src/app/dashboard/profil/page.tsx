'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Camera, Lock, Trash2, Save } from 'lucide-react';

export default function ProfilPage() {
  const { user, logout } = useAuthStore();
  const [form, setForm] = useState({
    prenom: user?.prenom || '',
    nom: user?.nom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
  });
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirmPassword: '',
  });
  const [saved, setSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleProfileSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordChange = () => {
    setPasswordSaved(true);
    setPasswords({ current: '', newPass: '', confirmPassword: '' });
    setTimeout(() => setPasswordSaved(false), 2000);
  };

  const inputClass =
    'w-full h-10 px-3 border border-stone-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900';

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">Mon profil</h1>
        <p className="text-stone-500 text-sm mt-1.5">Gérez vos informations personnelles</p>
      </div>

      <div className="rounded-lg border border-stone-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.prenom} className="h-16 w-16 rounded-md object-cover" />
            ) : (
              <div className="h-16 w-16 rounded-md bg-stone-900 flex items-center justify-center">
                <span className="text-xl font-semibold text-white">
                  {user?.prenom[0]}{user?.nom[0]}
                </span>
              </div>
            )}
            <button className="absolute -bottom-1 -right-1 p-1.5 bg-stone-900 text-white rounded-full hover:bg-stone-800">
              <Camera className="h-3 w-3" />
            </button>
          </div>
          <div>
            <h3 className="font-medium text-stone-900">{user?.prenom} {user?.nom}</h3>
            <p className="text-sm text-stone-500 capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-800 mb-1.5">Prénom</label>
              <input
                type="text"
                value={form.prenom}
                onChange={(e) => setForm((p) => ({ ...p, prenom: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-800 mb-1.5">Nom</label>
              <input
                type="text"
                value={form.nom}
                onChange={(e) => setForm((p) => ({ ...p, nom: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-800 mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-800 mb-1.5">Téléphone</label>
            <input
              type="tel"
              value={form.telephone}
              onChange={(e) => setForm((p) => ({ ...p, telephone: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleProfileSave}
              className="flex items-center gap-2 h-9 px-4 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-md text-sm transition-colors"
            >
              <Save className="h-4 w-4" />
              Enregistrer
            </button>
            {saved && <span className="text-sm text-success-600 font-medium">Profil enregistré !</span>}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-stone-200 p-6">
        <h2 className="text-base font-semibold text-stone-900 mb-4 flex items-center gap-2">
          <Lock className="h-4 w-4 text-stone-400" />
          Changer le mot de passe
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-800 mb-1.5">Mot de passe actuel</label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-800 mb-1.5">Nouveau mot de passe</label>
            <input
              type="password"
              value={passwords.newPass}
              onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-800 mb-1.5">Confirmer le mot de passe</label>
            <input
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePasswordChange}
              className="flex items-center gap-2 h-9 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium rounded-md text-sm transition-colors"
            >
              <Lock className="h-4 w-4" />
              Changer le mot de passe
            </button>
            {passwordSaved && <span className="text-sm text-success-600 font-medium">Mot de passe changé !</span>}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-stone-200 p-6">
        <h2 className="text-base font-semibold text-stone-900 mb-4">Paramètres du compte</h2>
        <div className="space-y-1">
          <div className="flex items-center justify-between py-3 border-b border-stone-200">
            <div>
              <p className="text-sm font-medium text-stone-900">Notifications email</p>
              <p className="text-xs text-stone-500">Recevoir des notifications par email</p>
            </div>
            <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-success-600">
              <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white translate-x-5" />
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-stone-900">Profil public</p>
              <p className="text-xs text-stone-500">Rendre votre profil visible publiquement</p>
            </div>
            <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-success-600">
              <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white translate-x-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-error-200 bg-error-50 p-6">
        <h2 className="text-base font-semibold text-error-900 mb-2 flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          Zone de danger
        </h2>
        <p className="text-sm text-error-700 mb-4">
          La suppression de votre compte est irréversible. Toutes vos données seront définitivement effacées.
        </p>
        <button
          onClick={() => {
            if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) {
              logout();
            }
          }}
          className="h-9 px-4 bg-error-600 hover:bg-error-700 text-white font-medium rounded-md text-sm transition-colors"
        >
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
}
