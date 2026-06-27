'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES } from '@/constants/routes';

export default function ConnexionPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      await login(email, password);
      const user = useAuthStore.getState().user;
      if (user?.role === 'admin') {
        router.push(ROUTES.ADMIN);
      } else {
        router.push(ROUTES.DASHBOARD);
      }
    } catch {
      setError('Identifiants incorrects. Veuillez réessayer.');
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-stone-900 text-center mb-2">
        Bon retour !
      </h1>
      <p className="text-sm text-stone-500 text-center mb-8">
        Connectez-vous pour accéder à votre espace
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-error-50 text-error-700 text-sm px-4 py-3 rounded-xl border border-error-200 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-error-400 shrink-0" />
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
            Email
          </label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 outline-none transition-all duration-200 hover:border-stone-300"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
            Mot de passe
          </label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-12 py-3 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 outline-none transition-all duration-200 hover:border-stone-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors p-1 rounded-lg hover:bg-stone-100"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-primary-600 border-stone-300 rounded-lg focus:ring-primary-500"
            />
            <span className="text-sm text-stone-600 group-hover:text-stone-900 transition-colors">Se souvenir de moi</span>
          </label>
          <Link
            href={ROUTES.MOT_DE_PASSE_OUBLIE}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            Mot de passe oublié?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-primary-300 disabled:to-primary-400 text-white font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-warm hover:shadow-lg active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Connexion en cours...
            </>
          ) : (
            'Se connecter'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-stone-600">
          Pas de compte?{' '}
          <Link href={ROUTES.INSCRIPTION} className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
            S&apos;inscrire
          </Link>
        </p>
      </div>

      <div className="mt-6 pt-6 border-t border-stone-100">
        <p className="text-xs text-stone-400 text-center leading-relaxed">
          Démo: <span className="font-medium text-stone-500">admin@test.com</span>,{' '}
          <span className="font-medium text-stone-500">artisan@test.com</span>, ou{' '}
          <span className="font-medium text-stone-500">citoyen@test.com</span>
        </p>
      </div>
    </>
  );
}
