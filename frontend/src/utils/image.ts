export function getPlaceholderImage(width: number = 400, height: number = 300): string {
  return `https://placehold.co/${width}x${height}/e2e8f0/64748b?text=Artisan`;
}

export function optimiserImage(url: string, width: number = 800): string {
  if (url.includes('placehold.co')) return url;
  return `${url}?w=${width}&q=80`;
}
