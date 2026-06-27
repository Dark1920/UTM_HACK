// Configuration du rate limiter avec Upstash Redis
// Limite la soumission d'avis pour prévenir le spam

import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Initialisation du client Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiter pour la soumission d'avis
// Maximum 5 avis par minute par IP
export const avisRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '60 s'),
});

// Rate limiter pour les inscriptions
// Maximum 3 inscriptions par heure par IP
export const inscriptionRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
});

// Rate limiter pour la recherche
// Maximum 30 recherches par minute par IP
export const rechercheRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '60 s'),
});

/**
 * Vérifie si une action est limitée par le rate limiter
 * @returns { success: boolean, remaining: number, reset: number }
 */
export async function checkRateLimit(
  limiter: typeof avisRateLimiter,
  identifier: string
) {
  try {
    const result = await limiter.limit(identifier);
    return { 
      success: result.success, 
      limit: result.limit, 
      remaining: result.remaining, 
      reset: result.reset 
    };
  } catch (error) {
    // En cas d'erreur Redis, on laisse passer (fail-open)
    console.error('Rate limiter error:', error);
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }
}
