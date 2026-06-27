const cache = new Map<string, { data: unknown; expiry: number }>();

export function getCache<T>(key: string): T | null {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  return item.data as T;
}

export function setCache(key: string, data: unknown, ttlMs: number = 5 * 60 * 1000) {
  cache.set(key, { data, expiry: Date.now() + ttlMs });
}

export function clearCache() {
  cache.clear();
}
