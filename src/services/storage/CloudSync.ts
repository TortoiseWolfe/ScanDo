import { NativeModules, Platform } from 'react-native';
import type { ScandoCloudkitModule, RemoteScanRecord } from '@/types/native';

const CloudKitModule = NativeModules.ScandoCloudKit as
  | ScandoCloudkitModule
  | undefined;

function getModule(): ScandoCloudkitModule {
  if (Platform.OS !== 'ios') {
    throw new Error('CloudKit sync is only available on iOS');
  }
  if (!CloudKitModule) {
    throw new Error(
      'ScandoCloudKit native module is not available. Build the native module first.',
    );
  }
  return CloudKitModule;
}

/**
 * iCloud CloudKit wrapper for scan backup and sync.
 */
export const CloudSync = {
  /**
   * Trigger a full sync with iCloud.
   * Pushes local changes and pulls remote changes.
   */
  async sync(): Promise<void> {
    const mod = getModule();
    await mod.sync();
  },

  /**
   * Upload a scan file to iCloud.
   * @returns The CloudKit record identifier.
   */
  async upload(scanId: string, filePath: string): Promise<string> {
    const mod = getModule();
    return mod.upload(scanId, filePath);
  },

  /**
   * Download a scan from iCloud.
   * @returns The local file path where the scan was saved.
   */
  async download(scanId: string): Promise<string> {
    const mod = getModule();
    return mod.download(scanId);
  },

  /**
   * List all scans stored in iCloud.
   */
  async getRemoteScans(): Promise<RemoteScanRecord[]> {
    const mod = getModule();
    return mod.listRemoteScans();
  },

  /**
   * Check if CloudKit is available on this device.
   */
  get isAvailable(): boolean {
    return Platform.OS === 'ios' && CloudKitModule != null;
  },
};
