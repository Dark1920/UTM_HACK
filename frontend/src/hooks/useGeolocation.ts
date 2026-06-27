'use client';

import { useState, useCallback, useRef } from 'react';

interface GeolocationState {
  position: { latitude: number; longitude: number } | null;
  isLoading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    isLoading: false,
    error: null,
  });
  const watchIdRef = useRef<number | null>(null);

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: 'Geolocation not supported' }));
      return;
    }

    setState((s) => ({ ...s, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          isLoading: false,
          error: null,
        });
      },
      (err) => {
        setState({
          position: null,
          isLoading: false,
          error: err.message,
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const watchPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: 'Geolocation not supported' }));
      return;
    }

    setState((s) => ({ ...s, isLoading: true, error: null }));

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          isLoading: false,
          error: null,
        });
      },
      (err) => {
        setState({
          position: null,
          isLoading: false,
          error: err.message,
        });
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  return {
    ...state,
    getCurrentPosition,
    watchPosition,
    stopWatching,
  };
}
