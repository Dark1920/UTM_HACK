import { mockCommerces } from '@/lib/mock-data';
import type { Commerce } from '@/types/commerce';

const favorisStore = new Map<string, Set<string>>();

export const favorisService = {
  async getAll(userId: string): Promise<Commerce[]> {
    await new Promise(r => setTimeout(r, 200));
    const userFavoris = favorisStore.get(userId) || new Set();
    return mockCommerces.filter(c => userFavoris.has(c.id));
  },

  async toggle(userId: string, commerceId: string): Promise<boolean> {
    await new Promise(r => setTimeout(r, 150));
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
    await new Promise(r => setTimeout(r, 100));
    const userFavoris = favorisStore.get(userId) || new Set();
    return userFavoris.has(commerceId);
  },

  async getCount(userId: string): Promise<number> {
    await new Promise(r => setTimeout(r, 100));
    const userFavoris = favorisStore.get(userId) || new Set();
    return userFavoris.size;
  },
};
