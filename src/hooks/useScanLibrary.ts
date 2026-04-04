import { useCallback, useEffect, useState } from 'react';
import type { ScanMetadata } from '@/types/scan';
import { ScanStorage } from '@/services/storage/ScanStorage';

interface UseScanLibraryReturn {
  scans: ScanMetadata[];
  loading: boolean;
  deleteScan: (scanId: string) => Promise<void>;
  renameScan: (scanId: string, newName: string) => Promise<void>;
  getScan: (scanId: string) => ScanMetadata | undefined;
  refresh: () => Promise<void>;
}

export function useScanLibrary(): UseScanLibraryReturn {
  const [scans, setScans] = useState<ScanMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  const loadScans = useCallback(async () => {
    setLoading(true);
    try {
      const loadedScans = await ScanStorage.listScans();
      setScans(loadedScans);
    } catch (error) {
      console.error('[useScanLibrary] Failed to load scans:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScans();
  }, [loadScans]);

  const deleteScan = useCallback(async (scanId: string) => {
    try {
      await ScanStorage.deleteScan(scanId);
      setScans((prev) => prev.filter((s) => s.id !== scanId));
    } catch (error) {
      console.error('[useScanLibrary] Failed to delete scan:', error);
      throw error;
    }
  }, []);

  const renameScan = useCallback(async (scanId: string, newName: string) => {
    try {
      const scan = await ScanStorage.loadScan(scanId);
      if (!scan) {
        throw new Error(`Scan not found: ${scanId}`);
      }

      const updated: ScanMetadata = {
        ...scan,
        name: newName,
        updatedAt: new Date().toISOString(),
      };
      await ScanStorage.saveScan(updated);

      setScans((prev) => prev.map((s) => (s.id === scanId ? updated : s)));
    } catch (error) {
      console.error('[useScanLibrary] Failed to rename scan:', error);
      throw error;
    }
  }, []);

  const getScan = useCallback(
    (scanId: string): ScanMetadata | undefined => {
      return scans.find((s) => s.id === scanId);
    },
    [scans],
  );

  return {
    scans,
    loading,
    deleteScan,
    renameScan,
    getScan,
    refresh: loadScans,
  };
}
