'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES } from '@/constants/routes';

export default function MotDePasseOubliePage() {
  const { resetPassword, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Veuillez entrer votre adresse email.');
      return;
    }

    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  if (submitted) {
    return (
      <div className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full border border-success-200 bg-success-50 flex items-center justify-center mb-4">
          <CheckCircle className="h-6 w-6 text-success-600" />
        </div>
        <h1 className="text-xl font-semibold text-stone-900 mb-2">Email envoyé !</h1>
        <p className="text-stone-500 text-sm mb-6">
          Si un compte existe avec l&apos;adresse <strong className="text-stone-700">{email}</strong>, vous
          recevrez un email avec les instructions pour réinitialiser votre mot de passe.
        </p>
        <Link href={ROUTES.CONNEXION} className="inline-flex items-center gap-2 text-stone-900 font-medium text-sm hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-xl font-semibold text-stone-900 text-center mb-1.5">Mot de passe oublié ?</h1>
      <p className="text-stone-500 text-sm text-center mb-7">
        Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-error-50 text-error-700 text-sm px-3.5 py-2.5 rounded-md border border-error-200">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-800 mb-1.5">
            Adresse email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full h-10 pl-9 pr-3 border border-stone-300 rounded-md text-sm outline-none transition-colors focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-medium rounded-md text-sm transition-colors flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href={ROUTES.CONNEXION} className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900">
          <ArrowLeft className="h-4 w-4" />
          Retour à la connexion
        </Link>
      </div>
    </>
  );
}
