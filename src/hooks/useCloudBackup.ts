import { useCallback, useState } from 'react';
import { CloudSync } from '@/services/storage/CloudSync';

type SyncState = 'idle' | 'syncing' | 'error' | 'complete';

interface UseCloudBackupReturn {
  syncState: SyncState;
  lastSyncAt: string | null;
  sync: () => Promise<void>;
  isSyncing: boolean;
}

export function useCloudBackup(): UseCloudBackupReturn {
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);

  const isSyncing = syncState === 'syncing';

  const sync = useCallback(async () => {
    if (isSyncing) {
      console.warn('[useCloudBackup] Sync already in progress');
      return;
    }

    setSyncState('syncing');
    try {
      await CloudSync.sync();
      const now = new Date().toISOString();
      setLastSyncAt(now);
      setSyncState('complete');
    } catch (error) {
      console.error('[useCloudBackup] Sync failed:', error);
      setSyncState('error');
    }
  }, [isSyncing]);

  return {
    syncState,
    lastSyncAt,
    sync,
    isSyncing,
  };
}
