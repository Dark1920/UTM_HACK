'use client';

import { useState, useEffect } from 'react';
import { useOfflineStore } from '@/stores/offline.store';

export function useOffline() {
  const [isOffline, setIsOffline] = useState(false);
  const setStoreOffline = useOfflineStore((s) => s.setOffline);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setStoreOffline(false);
    };
    const handleOffline = () => {
      setIsOffline(true);
      setStoreOffline(true);
    };

    setIsOffline(!navigator.onLine);
    setStoreOffline(!navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setStoreOffline]);

  return isOffline;
}
