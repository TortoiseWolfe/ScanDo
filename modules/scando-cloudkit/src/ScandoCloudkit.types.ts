export interface ScandoCloudkitModuleInterface {
  sync(): Promise<SyncResult>;
  upload(scanId: string, filePath: string): Promise<string>;
  download(scanId: string): Promise<string>;
  listRemoteScans(): Promise<RemoteScanRecord[]>;
}

export interface RemoteScanRecord {
  scanId: string;
  name: string;
  updatedAt: string;
  fileSize: number;
}

export interface SyncResult {
  uploaded: number;
  downloaded: number;
  conflicts: number;
  errors: string[];
}
