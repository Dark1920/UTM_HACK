'use client';

import { useState, useCallback, useMemo } from 'react';

interface PaginationState<T> {
  items: T[];
  page: number;
  totalPages: number;
  perPage: number;
}

export function usePagination<T>(initialItems: T[] = [], perPage = 10) {
  const [state, setState] = useState<PaginationState<T>>({
    items: initialItems,
    page: 1,
    totalPages: Math.max(1, Math.ceil(initialItems.length / perPage)),
    perPage,
  });

  const pagedItems = useMemo(() => {
    const start = (state.page - 1) * state.perPage;
    return state.items.slice(start, start + state.perPage);
  }, [state.items, state.page, state.perPage]);

  const setItems = useCallback(
    (items: T[]) => {
      setState((s) => ({
        ...s,
        items,
        page: 1,
        totalPages: Math.max(1, Math.ceil(items.length / s.perPage)),
      }));
    },
    []
  );

  const goToPage = useCallback((page: number) => {
    setState((s) => ({
      ...s,
      page: Math.max(1, Math.min(page, s.totalPages)),
    }));
  }, []);

  const nextPage = useCallback(() => {
    setState((s) => ({
      ...s,
      page: Math.min(s.page + 1, s.totalPages),
    }));
  }, []);

  const prevPage = useCallback(() => {
    setState((s) => ({
      ...s,
      page: Math.max(s.page - 1, 1),
    }));
  }, []);

  return {
    items: pagedItems,
    page: state.page,
    totalPages: state.totalPages,
    perPage: state.perPage,
    totalItems: state.items.length,
    nextPage,
    prevPage,
    goToPage,
    setItems,
  };
}
