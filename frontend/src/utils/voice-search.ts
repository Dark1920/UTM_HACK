import type { Categorie } from '@/types/commerce';
import { genererSlug } from './slug';

function normalize(value: string): string {
  return genererSlug(value).toLowerCase();
}

export function resolveCategoryId(input: string | null | undefined, categories: Categorie[]): string | null {
  if (!input) return null;

  const target = normalize(input);
  const match = categories.find((category) => {
    return (
      normalize(category.id) === target ||
      normalize(category.slug) === target ||
      normalize(category.nom) === target
    );
  });

  return match?.id ?? null;
}
