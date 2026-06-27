'use client';

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

  return <img src={src} alt={alt} className={className} loading="lazy" onError={onError} />;
}
