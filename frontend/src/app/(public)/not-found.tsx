import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-stone-200 tracking-tight mb-6">404</p>
        <h1 className="text-2xl font-semibold text-stone-900 mb-2 tracking-tight">
          Page introuvable
        </h1>
        <p className="text-stone-500 mb-7 leading-relaxed">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-11 px-5 bg-stone-900 text-white font-medium rounded-md hover:bg-stone-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
