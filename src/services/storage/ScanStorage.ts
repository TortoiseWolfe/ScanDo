import * as FileSystem from 'expo-file-system';
import type { ScanMetadata } from '@/types/scan';

const SCANS_DIR = `${FileSystem.documentDirectory}scans/`;
const METADATA_FILE = 'metadata.json';

/**
 * Local persistence layer for scan data using expo-file-system.
 */
export const ScanStorage = {
  /**
   * Ensure the scans directory exists.
   */
  async ensureDir(): Promise<void> {
    const info = await FileSystem.getInfoAsync(SCANS_DIR);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(SCANS_DIR, { intermediates: true });
    }
  },

  /**
   * Save scan metadata to local storage.
   */
  async saveScan(metadata: ScanMetadata): Promise<void> {
    await this.ensureDir();
    const scanDir = `${SCANS_DIR}${metadata.id}/`;
    const dirInfo = await FileSystem.getInfoAsync(scanDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(scanDir, { intermediates: true });
    }

    const filePath = `${scanDir}${METADATA_FILE}`;
    await FileSystem.writeAsStringAsync(
      filePath,
      JSON.stringify(metadata, null, 2),
    );
  },

  /**
   * Load scan metadata by ID.
   */
  async loadScan(scanId: string): Promise<ScanMetadata | null> {
    try {
      const filePath = `${SCANS_DIR}${scanId}/${METADATA_FILE}`;
      const info = await FileSystem.getInfoAsync(filePath);
      if (!info.exists) return null;

      const content = await FileSystem.readAsStringAsync(filePath);
      return JSON.parse(content) as ScanMetadata;
    } catch (error) {
      console.error(`[ScanStorage] Failed to load scan ${scanId}:`, error);
      return null;
    }
  },

  /**
   * List all saved scans, sorted by updatedAt descending.
   */
  async listScans(): Promise<ScanMetadata[]> {
    await this.ensureDir();

    try {
      const entries = await FileSystem.readDirectoryAsync(SCANS_DIR);
      const scans: ScanMetadata[] = [];

      for (const entry of entries) {
        const metaPath = `${SCANS_DIR}${entry}/${METADATA_FILE}`;
        const info = await FileSystem.getInfoAsync(metaPath);
        if (!info.exists) continue;

        try {
          const content = await FileSystem.readAsStringAsync(metaPath);
          const metadata = JSON.parse(content) as ScanMetadata;
          scans.push(metadata);
        } catch {
          console.warn(`[ScanStorage] Skipping corrupt scan entry: ${entry}`);
        }
      }

      // Sort by most recently updated first
      scans.sort((a, b) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });

      return scans;
    } catch (error) {
      console.error('[ScanStorage] Failed to list scans:', error);
      return [];
    }
  },

  /**
   * Delete a scan and its associated files.
   */
  async deleteScan(scanId: string): Promise<void> {
    const scanDir = `${SCANS_DIR}${scanId}/`;
    const info = await FileSystem.getInfoAsync(scanDir);
    if (info.exists) {
      await FileSystem.deleteAsync(scanDir, { idempotent: true });
    }
  },

  /**
   * Get the directory path for a specific scan's files.
   */
  getScanDirectory(scanId: string): string {
    return `${SCANS_DIR}${scanId}/`;
  },
};
