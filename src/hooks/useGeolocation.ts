import { useState, useCallback, useEffect, useRef } from 'react';
import type { GeoLocation } from '@/types/scan';

interface UseGeolocationReturn {
  location: GeoLocation | null;
  isTracking: boolean;
  isGeoTrackingAvailable: boolean;
  startTracking: () => Promise<void>;
  stopTracking: () => Promise<void>;
  error: string | null;
}

/**
 * Hook for GPS/ARGeoTracking-based geolocation tagging of scans.
 *
 * Automatically starts CoreLocation when a scan begins.
 * Uses ARGeoTrackingConfiguration in supported cities (Apple-mapped areas),
 * falls back to standard CoreLocation GPS elsewhere.
 */
export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isGeoTrackingAvailable, setIsGeoTrackingAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const moduleRef = useRef<Record<string, unknown> | null>(null);

  useEffect(() => {
    // Dynamically import native module to avoid crash on non-iOS platforms
    try {
      const { requireNativeModule } = require('expo-modules-core');
      const mod = requireNativeModule('ScandoLidar');
      moduleRef.current = mod;

      // Check ARGeoTracking availability
      if (typeof mod.isGeoTrackingAvailable === 'function') {
        mod.isGeoTrackingAvailable().then((available: boolean) => {
          setIsGeoTrackingAvailable(available);
        });
      }
    } catch {
      console.warn(
        'useGeolocation: Native module not available, geolocation disabled',
      );
    }
  }, []);

  const startTracking = useCallback(async () => {
    try {
      setError(null);
      setIsTracking(true);

      const mod = moduleRef.current;
      if (mod && typeof mod.startGeoTracking === 'function') {
        await (mod.startGeoTracking as () => Promise<void>)();
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to start geo tracking';
      setError(message);
      setIsTracking(false);
    }
  }, []);

  const stopTracking = useCallback(async () => {
    try {
      const mod = moduleRef.current;
      if (mod && typeof mod.stopGeoTracking === 'function') {
        const loc = await (
          mod.getCurrentLocation as () => Promise<GeoLocation>
        )();
        setLocation(loc);
        await (mod.stopGeoTracking as () => Promise<void>)();
      }
      setIsTracking(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to stop geo tracking';
      setError(message);
      setIsTracking(false);
    }
  }, []);

  return {
    location,
    isTracking,
    isGeoTrackingAvailable,
    startTracking,
    stopTracking,
    error,
  };
}
