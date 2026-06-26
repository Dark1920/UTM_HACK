import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

const footerLinks = [
  { href: ROUTES.ANNUAIRE, label: 'Annuaire' },
  { href: ROUTES.URGENCE, label: 'Urgence' },
  { href: 'mailto:contact@artisansbf.com', label: 'Contact' },
];

const socialLinks = [
  { href: '#', label: 'Facebook', icon: 'FB' },
  { href: '#', label: 'Twitter', icon: 'TW' },
  { href: '#', label: 'Instagram', icon: 'IG' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href={ROUTES.HOME} className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-amber-500">Artisans</span>
              <span className="text-xl font-bold text-white">BF</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Le annuaire des artisans du Burkina Faso. Trouvez le bon artisan pour tous vos besoins.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Liens utiles
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-amber-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Suivez-nous
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="h-10 w-10 rounded-lg bg-gray-800 hover:bg-amber-600 flex items-center justify-center text-xs font-bold text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} ArtisansBF. Tous droits réservés.
          </p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-amber-400 bg-amber-500/10 rounded-full border border-amber-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Propulsé par l&apos;IA
          </span>
        </div>
      </div>
    </footer>
  );
}
