import Link from 'next/link';
import { Hammer } from 'lucide-react';
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
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link href={ROUTES.HOME} className="flex items-center gap-2.5 mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 text-white">
                <Hammer className="h-4.5 w-4.5" />
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-bold text-primary-400">Artisans</span>
                <span className="text-xl font-bold text-white">BF</span>
              </div>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed max-w-xs">
              Le premier annuaire intelligent des artisans du Burkina Faso. Trouvez le bon artisan pour tous vos besoins.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Liens utiles
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Suivez-nous
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="h-11 w-11 rounded-xl bg-stone-800 hover:bg-primary-600 flex items-center justify-center text-xs font-bold text-stone-400 hover:text-white transition-all duration-200 hover:shadow-lg hover:shadow-primary-600/20"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500">
            &copy; {new Date().getFullYear()} ArtisansBF. Tous droits réservés.
          </p>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-primary-400 bg-primary-500/10 rounded-full border border-primary-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-pulse" />
            Propulsé par l&apos;IA
          </span>
        </div>
      </div>
    </footer>
  );
}
