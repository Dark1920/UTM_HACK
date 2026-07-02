'use client';

import { useCallback } from 'react';
import { useCommerceStore } from '@/stores/commerce.store';
import { commerceService } from '@/services/commerce.service';
import type { Commerce, CreateCommerceData } from '@/types/commerce';

export function useCommerce() {
  const commerces = useCommerceStore((s) => s.commerces);
  const selectedCommerce = useCommerceStore((s) => s.selectedCommerce);
  const isLoading = useCommerceStore((s) => s.isLoading);

  const loadCommerces = useCallback(async () => {
    useCommerceStore.setState({ isLoading: true });
    try {
      const data = await commerceService.getAll();
      useCommerceStore.getState().setCommerces(data);
    } catch (error) {
      console.error('Failed to load commerces:', error);
    } finally {
      useCommerceStore.setState({ isLoading: false });
    }
  }, []);

  const selectCommerce = useCallback((commerce: Commerce | null) => {
    useCommerceStore.getState().selectCommerce(commerce);
  }, []);

  const createCommerce = useCallback(
    async (data: CreateCommerceData): Promise<Commerce> => {
      const newCommerce = await commerceService.create(data);
      await loadCommerces();
      return newCommerce;
    },
    [loadCommerces]
  );

  const updateCommerce = useCallback(
    async (id: string, data: Partial<CreateCommerceData>): Promise<Commerce> => {
      const updated = await commerceService.update(id, data);
      await loadCommerces();
      return updated;
    },
    [loadCommerces]
  );

  const deleteCommerce = useCallback(
    async (id: string) => {
      await commerceService.delete(id);
      await loadCommerces();
    },
    [loadCommerces]
  );

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
