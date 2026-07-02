'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface RouteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  message?: string;
}

/**
 * UI d'erreur partagée pour les `error.tsx` de chaque segment (App Router).
 */
export function RouteError({ error, reset, message }: RouteErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-error-50 mb-4">
          <AlertTriangle className="h-6 w-6 text-error-500" />
        </div>
        <h1 className="text-xl font-semibold text-stone-900 mb-2">
          {message || 'Une erreur est survenue'}
        </h1>
        <p className="text-stone-500 text-sm mb-6">
          {error.message || 'Impossible de charger cette page. Réessayez.'}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 h-10 px-4 bg-stone-900 text-white text-sm font-medium rounded-md hover:bg-stone-800 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Réessayer
        </button>
      </div>
    </div>
  );
}
