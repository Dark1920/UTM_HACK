import { commerceService } from '@/services/commerce.service';
import type { Commerce } from '@/types/commerce';

// In-memory store for favorites (no backend table yet)
const favorisStore = new Map<string, Set<string>>();

export const favorisService = {
  async getAll(userId: string): Promise<Commerce[]> {
    const userFavoris = favorisStore.get(userId) || new Set();
    if (userFavoris.size === 0) return [];

    const allCommerces = await commerceService.getAll();
    return allCommerces.filter((c) => userFavoris.has(c.id));
  },

  async toggle(userId: string, commerceId: string): Promise<boolean> {
    if (!favorisStore.has(userId)) {
      favorisStore.set(userId, new Set());
    }
    const userFavoris = favorisStore.get(userId)!;
    if (userFavoris.has(commerceId)) {
      userFavoris.delete(commerceId);
      return false;
    }
    userFavoris.add(commerceId);
    return true;
  },

  async isFavori(userId: string, commerceId: string): Promise<boolean> {
    const userFavoris = favorisStore.get(userId) || new Set();
    return userFavoris.has(commerceId);
  },

  async getCount(userId: string): Promise<number> {
    const userFavoris = favorisStore.get(userId) || new Set();
    return userFavoris.size;
  },
};
