import { create } from 'zustand';
import type { ScanSession, ScanMetadata } from '@/types/scan';

interface ScanState {
  /** The currently active scan session, or null if no session is running. */
  session: ScanSession | null;
  /** Recently accessed scans for quick access. */
  recentScans: ScanMetadata[];
}

interface ScanActions {
  /** Set or update the active scan session. */
  setSession: (session: ScanSession | null) => void;
  /** Update specific fields of the active session. */
  updateSession: (updates: Partial<ScanSession>) => void;
  /** Clear the active session. */
  clearSession: () => void;
  /** Add a scan to the recent scans list (deduplicates by ID, max 20). */
  addRecentScan: (metadata: ScanMetadata) => void;
  /** Remove a scan from the recent list by ID. */
  removeRecentScan: (scanId: string) => void;
}

const MAX_RECENT_SCANS = 20;

export const useScanStore = create<ScanState & ScanActions>((set) => ({
  session: null,
  recentScans: [],

  setSession: (session) => set({ session }),

  updateSession: (updates) =>
    set((state) => ({
      session: state.session ? { ...state.session, ...updates } : null,
    })),

  clearSession: () => set({ session: null }),

  addRecentScan: (metadata) =>
    set((state) => {
      // Remove duplicate if it already exists
      const filtered = state.recentScans.filter((s) => s.id !== metadata.id);
      // Prepend new scan and cap the list
      const updated = [metadata, ...filtered].slice(0, MAX_RECENT_SCANS);
      return { recentScans: updated };
    }),

  removeRecentScan: (scanId) =>
    set((state) => ({
      recentScans: state.recentScans.filter((s) => s.id !== scanId),
    })),
}));
