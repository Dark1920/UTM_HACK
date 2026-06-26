import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-amber-500 mb-4">404</div>
        <div className="w-24 h-1 bg-amber-500 mx-auto mb-6 rounded-full" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Page introuvable
        </h1>
        <p className="text-gray-500 mb-8">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
