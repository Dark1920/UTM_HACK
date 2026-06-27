'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full border border-success-200 bg-success-50 flex items-center justify-center mb-4">
          <CheckCircle className="h-6 w-6 text-success-600" />
        </div>
        <h1 className="text-xl font-semibold text-stone-900 mb-2">Mot de passe réinitialisé !</h1>
        <p className="text-stone-500 text-sm mb-6">
          Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.
        </p>
        <Link
          href={ROUTES.CONNEXION}
          className="inline-flex items-center justify-center w-full h-10 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-md text-sm transition-colors"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-xl font-semibold text-stone-900 text-center mb-1.5">Nouveau mot de passe</h1>
      <p className="text-stone-500 text-sm text-center mb-7">
        Entrez votre nouveau mot de passe ci-dessous.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-error-50 text-error-700 text-sm px-3.5 py-2.5 rounded-md border border-error-200">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-800 mb-1.5">
            Nouveau mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 pl-9 pr-10 border border-stone-300 rounded-md text-sm outline-none transition-colors focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-800 mb-1.5">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 pl-9 pr-10 border border-stone-300 rounded-md text-sm outline-none transition-colors focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-medium rounded-md text-sm transition-colors flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href={ROUTES.CONNEXION} className="text-sm text-stone-600 hover:text-stone-900">
          Retour à la connexion
        </Link>
      </div>
    </>
  );
}
