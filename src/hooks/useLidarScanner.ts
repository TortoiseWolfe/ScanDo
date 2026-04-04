import { useCallback, useEffect, useRef, useState } from 'react';
import { NativeModules, Platform } from 'react-native';
import type { ScandoLidarModule } from '@/types/native';
import type { ScanSession } from '@/types/scan';

const LidarModule = NativeModules.ScandoLidar as ScandoLidarModule | undefined;

type SessionState = ScanSession['state'];

interface UseLidarScannerReturn {
  isAvailable: boolean;
  sessionState: SessionState;
  startScan: () => Promise<void>;
  stopScan: () => Promise<void>;
  pauseScan: () => Promise<void>;
  resumeScan: () => Promise<void>;
}

export function useLidarScanner(): UseLidarScannerReturn {
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [isAvailable, setIsAvailable] = useState(false);
  const moduleRef = useRef(LidarModule);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      console.warn('[useLidarScanner] LiDAR is only available on iOS');
      setIsAvailable(false);
      return;
    }

    if (!moduleRef.current) {
      console.warn(
        '[useLidarScanner] ScandoLidar native module is not available. ' +
          'Ensure the native module is built and linked.',
      );
      setIsAvailable(false);
      return;
    }

    try {
      const available = moduleRef.current.isLidarAvailable();
      setIsAvailable(available);
      if (!available) {
        console.warn(
          '[useLidarScanner] LiDAR hardware not detected on this device',
        );
      }
    } catch {
      console.warn('[useLidarScanner] Failed to check LiDAR availability');
      setIsAvailable(false);
    }
  }, []);

  const startScan = useCallback(async () => {
    if (!moduleRef.current) {
      console.warn(
        '[useLidarScanner] Cannot start scan: native module unavailable',
      );
      return;
    }
    try {
      setSessionState('scanning');
      await moduleRef.current.startSession();
    } catch (error) {
      setSessionState('error');
      console.error('[useLidarScanner] Failed to start scan session:', error);
    }
  }, []);

  const stopScan = useCallback(async () => {
    if (!moduleRef.current) {
      console.warn(
        '[useLidarScanner] Cannot stop scan: native module unavailable',
      );
      return;
    }
    try {
      setSessionState('processing');
      await moduleRef.current.stopSession();
      setSessionState('complete');
    } catch (error) {
      setSessionState('error');
      console.error('[useLidarScanner] Failed to stop scan session:', error);
    }
  }, []);

  const pauseScan = useCallback(async () => {
    if (!moduleRef.current) {
      console.warn(
        '[useLidarScanner] Cannot pause scan: native module unavailable',
      );
      return;
    }
    try {
      await moduleRef.current.pauseSession();
      setSessionState('paused');
    } catch (error) {
      console.error('[useLidarScanner] Failed to pause scan session:', error);
    }
  }, []);

  const resumeScan = useCallback(async () => {
    if (!moduleRef.current) {
      console.warn(
        '[useLidarScanner] Cannot resume scan: native module unavailable',
      );
      return;
    }
    try {
      await moduleRef.current.resumeSession();
      setSessionState('scanning');
    } catch (error) {
      console.error('[useLidarScanner] Failed to resume scan session:', error);
    }
  }, []);

  return {
    isAvailable,
    sessionState,
    startScan,
    stopScan,
    pauseScan,
    resumeScan,
  };
}
