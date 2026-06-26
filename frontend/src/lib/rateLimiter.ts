const requests = new Map<string, number[]>();

export function rateLimiter(key: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const timestamps = requests.get(key) || [];
  const recent = timestamps.filter(t => now - t < windowMs);
  if (recent.length >= limit) return false;
  recent.push(now);
  requests.set(key, recent);
  return true;
}
