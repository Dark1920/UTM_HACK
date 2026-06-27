'use client';

import { useCallback } from 'react';
import { useCommerceStore } from '@/stores/commerce.store';
import { commerceService } from '@/services/commerce.service';
import type { Commerce, CreateCommerceData } from '@/types/commerce';

export function useCommerce() {
  const commerces = useCommerceStore((s) => s.commerces);
  const selectedCommerce = useCommerceStore((s) => s.selectedCommerce);
  const isLoading = useCommerceStore((s) => s.isLoading);
  const loadCommerces = useCommerceStore((s) => s.loadCommerces);

  const selectCommerce = useCallback((commerce: Commerce | null) => {
    useCommerceStore.getState().selectCommerce(commerce);
  }, []);

  const createCommerce = useCallback(
    async (data: CreateCommerceData): Promise<Commerce> => {
      const store = useCommerceStore.getState();
      const user = (await import('@/stores/auth.store')).useAuthStore.getState().user;
      const newCommerce = await commerceService.create(data, user?.id || '');
      store.setCommerces([...store.commerces, newCommerce]);
      return newCommerce;
    },
    []
  );

  const updateCommerce = useCallback(
    async (id: string, data: Partial<CreateCommerceData>): Promise<Commerce> => {
      const updated = await commerceService.update(id, data);
      const store = useCommerceStore.getState();
      store.setCommerces(
        store.commerces.map((c) => (c.id === id ? updated : c))
      );
      return updated;
    },
    []
  );

  const deleteCommerce = useCallback(async (id: string) => {
    await commerceService.delete(id);
    const store = useCommerceStore.getState();
    store.setCommerces(store.commerces.filter((c) => c.id !== id));
  }, []);

  return {
    commerces,
    selectedCommerce,
    isLoading,
    loadCommerces,
    selectCommerce,
    createCommerce,
    updateCommerce,
    deleteCommerce,
  };
}
