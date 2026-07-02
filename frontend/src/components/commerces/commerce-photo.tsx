'use client';

import Image from 'next/image';
import { usePexelsPhotos } from '@/hooks/usePexelsPhotos';
import { CATEGORY_PEXELS_QUERY } from '@/constants/pexels';

interface CommercePhotoProps {
  categorieId: string;
  fallbackSrc: string;
  alt: string;
  index?: number;
  className?: string;
  onError?: () => void;
}

/**
 * Affiche une photo Pexels pertinente pour la catégorie du commerce.
 * Retombe sur `fallbackSrc` (photo mock) tant que la clé Pexels n'est
 * pas configurée, pendant le chargement, ou en cas d'échec.
 *
 * Rendu via `next/image` en mode `fill` : le `className` reçu (taille +
 * arrondis) est porté par le conteneur relatif, ce qui couvre aussi bien
 * les cartes plein-largeur que les vignettes de taille fixe.
 * `unoptimized` : les sources sont externes/variables (Pexels ou URLs DB),
 * on évite ainsi toute erreur de domaine non autorisé.
 */
export function CommercePhoto({
  categorieId,
  fallbackSrc,
  alt,
  index = 0,
  className,
  onError,
}: CommercePhotoProps) {
  const query = CATEGORY_PEXELS_QUERY[categorieId] ?? null;
  const { photos } = usePexelsPhotos(query, 4);
  const src = photos.length > 0 ? photos[index % photos.length] : fallbackSrc;

  if (!src) {
    return <span className={`block bg-stone-100 ${className ?? ''}`} aria-hidden="true" />;
  }

  return (
    <span className={`relative block overflow-hidden ${className ?? ''}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, 400px"
        className="object-cover"
        onError={onError}
        unoptimized
      />
    </span>
  );
}
