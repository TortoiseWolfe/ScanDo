import { describe, it, expect, beforeEach } from 'vitest';
import { useScanStore } from './useScanStore';
import type { ScanSession, ScanMetadata } from '@/types/scan';

const makeScanSession = (
  overrides: Partial<ScanSession> = {},
): ScanSession => ({
  id: 'session-1',
  state: 'idle',
  ...overrides,
});

const makeScanMetadata = (
  overrides: Partial<ScanMetadata> = {},
): ScanMetadata => ({
  id: 'scan-1',
  name: 'Test Scan',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  duration: 30,
  vertexCount: 1000,
  faceCount: 500,
  fileSize: 2048,
  ...overrides,
});

describe('useScanStore', () => {
  beforeEach(() => {
    useScanStore.setState({ session: null, recentScans: [] });
  });

  describe('initial state', () => {
    it('has session as null and recentScans as empty array', () => {
      const { session, recentScans } = useScanStore.getState();
      expect(session).toBeNull();
      expect(recentScans).toEqual([]);
    });
  });

  describe('setSession', () => {
    it('sets the session', () => {
      const session = makeScanSession();
      useScanStore.getState().setSession(session);
      expect(useScanStore.getState().session).toEqual(session);
    });

    it('can set session to null', () => {
      useScanStore.getState().setSession(makeScanSession());
      useScanStore.getState().setSession(null);
      expect(useScanStore.getState().session).toBeNull();
    });
  });

  describe('updateSession', () => {
    it('merges partial updates into the existing session', () => {
      const session = makeScanSession({ state: 'idle' });
      useScanStore.getState().setSession(session);

      useScanStore
        .getState()
        .updateSession({
          state: 'scanning',
          startedAt: '2026-01-01T00:01:00Z',
        });

      const updated = useScanStore.getState().session;
      expect(updated).toEqual({
        ...session,
        state: 'scanning',
        startedAt: '2026-01-01T00:01:00Z',
      });
    });

    it('keeps session null when updating a null session', () => {
      useScanStore.getState().updateSession({ state: 'scanning' });
      expect(useScanStore.getState().session).toBeNull();
    });
  });

  describe('clearSession', () => {
    it('sets session to null', () => {
      useScanStore.getState().setSession(makeScanSession());
      useScanStore.getState().clearSession();
      expect(useScanStore.getState().session).toBeNull();
    });
  });

  describe('addRecentScan', () => {
    it('adds a scan to the front of the list', () => {
      const scan1 = makeScanMetadata({ id: 'scan-1' });
      const scan2 = makeScanMetadata({ id: 'scan-2', name: 'Second Scan' });

      useScanStore.getState().addRecentScan(scan1);
      useScanStore.getState().addRecentScan(scan2);

      const { recentScans } = useScanStore.getState();
      expect(recentScans[0]).toEqual(scan2);
      expect(recentScans[1]).toEqual(scan1);
    });

    it('deduplicates by id, moving existing scan to front', () => {
      const scan1 = makeScanMetadata({ id: 'scan-1', name: 'Original' });
      const scan2 = makeScanMetadata({ id: 'scan-2', name: 'Other' });
      const scan1Updated = makeScanMetadata({ id: 'scan-1', name: 'Updated' });

      useScanStore.getState().addRecentScan(scan1);
      useScanStore.getState().addRecentScan(scan2);
      useScanStore.getState().addRecentScan(scan1Updated);

      const { recentScans } = useScanStore.getState();
      expect(recentScans).toHaveLength(2);
      expect(recentScans[0]).toEqual(scan1Updated);
      expect(recentScans[1]).toEqual(scan2);
    });

    it('caps the list at 20 items', () => {
      for (let i = 0; i < 25; i++) {
        useScanStore
          .getState()
          .addRecentScan(
            makeScanMetadata({ id: `scan-${i}`, name: `Scan ${i}` }),
          );
      }

      const { recentScans } = useScanStore.getState();
      expect(recentScans).toHaveLength(20);
      // Most recent scan should be at index 0
      expect(recentScans[0].id).toBe('scan-24');
    });
  });

  describe('removeRecentScan', () => {
    it('removes a scan by id', () => {
      const scan1 = makeScanMetadata({ id: 'scan-1' });
      const scan2 = makeScanMetadata({ id: 'scan-2', name: 'Other' });

      useScanStore.getState().addRecentScan(scan1);
      useScanStore.getState().addRecentScan(scan2);
      useScanStore.getState().removeRecentScan('scan-1');

      const { recentScans } = useScanStore.getState();
      expect(recentScans).toHaveLength(1);
      expect(recentScans[0]).toEqual(scan2);
    });

    it('is a no-op when the id does not exist', () => {
      const scan = makeScanMetadata({ id: 'scan-1' });
      useScanStore.getState().addRecentScan(scan);
      useScanStore.getState().removeRecentScan('nonexistent');

      expect(useScanStore.getState().recentScans).toHaveLength(1);
    });
  });
});
