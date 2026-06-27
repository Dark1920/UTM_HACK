import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center h-28 w-28 rounded-3xl bg-gradient-to-br from-primary-50 to-primary-100 mb-8">
          <span className="text-6xl font-bold text-primary-500">404</span>
        </div>
        <h1 className="text-3xl font-bold text-stone-900 mb-3 tracking-tight">
          Page introuvable
        </h1>
        <p className="text-stone-500 mb-8 leading-relaxed">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-warm hover:shadow-lg active:scale-[0.98]"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
