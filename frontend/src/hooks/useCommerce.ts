'use client';

import { useCallback } from 'react';
import { useCommerceStore, loadMockCommerces } from '@/stores/commerce.store';
import type { Commerce, CreateCommerceData } from '@/types/commerce';
import { mockCommerces } from '@/lib/mock-data';

export function useCommerce() {
  const commerces = useCommerceStore((s) => s.commerces);
  const selectedCommerce = useCommerceStore((s) => s.selectedCommerce);
  const isLoading = useCommerceStore((s) => s.isLoading);

  const loadCommerces = useCallback(() => {
    useCommerceStore.getState().setCommerces(mockCommerces);
  }, []);

  const selectCommerce = useCallback((commerce: Commerce | null) => {
    useCommerceStore.getState().selectCommerce(commerce);
  }, []);

  const createCommerce = useCallback(
    async (data: CreateCommerceData): Promise<Commerce> => {
      const newCommerce: Commerce = {
        id: `com-${Date.now()}`,
        ...data,
        artisanId: 'art-1',
        photos: [],
        note: 0,
        nombreAvis: 0,
        nombreVues: 0,
        nombreAppels: 0,
        nombreClicsWhatsApp: 0,
        estPublic: true,
        dateCreation: new Date().toISOString(),
        dateModification: new Date().toISOString(),
      };
      const store = useCommerceStore.getState();
      store.setCommerces([...store.commerces, newCommerce]);
      return newCommerce;
    },
    []
  );

  const updateCommerce = useCallback(
    async (id: string, data: Partial<CreateCommerceData>): Promise<Commerce> => {
      const store = useCommerceStore.getState();
      const existing = store.commerces.find((c) => c.id === id);
      if (!existing) throw new Error('Commerce not found');
      const updated: Commerce = {
        ...existing,
        ...data,
        dateModification: new Date().toISOString(),
      };
      store.setCommerces(
        store.commerces.map((c) => (c.id === id ? updated : c))
      );
      return updated;
    },
    []
  );

  const deleteCommerce = useCallback(async (id: string) => {
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
