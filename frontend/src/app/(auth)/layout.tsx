import Link from 'next/link';
import { Hammer } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4 relative overflow-hidden">
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary-100/30 rounded-full blur-3xl" />
      <div className="w-full max-w-md relative">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-200/50 group-hover:shadow-xl group-hover:shadow-primary-200/60 transition-all duration-300">
              <Hammer className="h-5 w-5" />
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-3xl font-bold text-primary-600">Artisans</span>
              <span className="text-3xl font-bold text-stone-900">BF</span>
            </div>
          </Link>
          <p className="text-sm text-stone-500 mt-3">
            L&apos;annuaire des artisans du Burkina Faso
          </p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
