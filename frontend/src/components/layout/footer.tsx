import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

const columns = [
  {
    title: 'Plateforme',
    links: [
      { href: ROUTES.ANNUAIRE, label: 'Annuaire' },
      { href: ROUTES.URGENCE, label: "J'ai une urgence" },
      { href: ROUTES.INSCRIPTION, label: 'Devenir artisan' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { href: 'mailto:dayende.ib@gmail.com', label: 'Contact' },
      { href: '#', label: 'Aide' },
      { href: '#', label: "Conditions d'utilisation" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10">
          <div>
            <Link href={ROUTES.HOME} className="flex items-center gap-2 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-stone-900 text-sm font-bold">
                A
              </span>
              <span className="text-[15px] font-semibold text-white">ArtisansBF</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              L&apos;annuaire géolocalisé des artisans du Burkina Faso. Trouvez le bon
              professionnel, près de chez vous.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-stone-500">
            &copy; {new Date().getFullYear()} ArtisansBF par Regenesis. Tous droits réservés.
          </p>
          <p className="text-xs text-stone-500">Burkina Faso</p>
        </div>
      </div>
    </footer>
  );
}
