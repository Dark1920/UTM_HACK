'use client';

import { RouteError } from '@/components/shared/route-error';

// global-error remplace le layout racine : il doit fournir <html>/<body>.
export default function GlobalError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fr">
      <body>
        <RouteError {...props} message="Erreur inattendue" />
      </body>
    </html>
  );
}
