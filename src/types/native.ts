export interface ScandoLidarModule {
  startSession(): Promise<void>;
  stopSession(): Promise<void>;
  pauseSession(): Promise<void>;
  resumeSession(): Promise<void>;
  getMeshSnapshot(): Promise<NativeMeshData>;
  exportToFile(format: string, path: string): Promise<string>;
  isLidarAvailable(): boolean;
}

export interface NativeMeshData {
  vertices: number[];
  faces: number[];
  normals: number[];
  vertexCount: number;
  faceCount: number;
}

export interface ScandoStorekitModule {
  getProducts(): Promise<NativeProduct[]>;
  purchase(productId: string): Promise<NativePurchaseResult>;
  restorePurchases(): Promise<NativePurchaseResult[]>;
  getEntitlements(): Promise<NativeEntitlement>;
}

export interface NativeProduct {
  id: string;
  displayName: string;
  description: string;
  displayPrice: string;
  type: 'autoRenewable' | 'nonRenewable' | 'nonConsumable';
}

export interface NativePurchaseResult {
  success: boolean;
  productId: string;
  transactionId?: string;
  error?: string;
}

export interface NativeEntitlement {
  tier: 'free' | 'pro';
  isActive: boolean;
  expiresAt?: string;
}

export interface ScandoCloudkitModule {
  sync(): Promise<void>;
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

export interface ScandoGeoLocationModule {
  startTracking(): Promise<void>;
  stopTracking(): Promise<void>;
  getCurrentLocation(): Promise<NativeGeoLocation>;
  isGeoTrackingAvailable(): Promise<boolean>;
  getGeoLocation(
    arLocalX: number,
    arLocalY: number,
    arLocalZ: number,
  ): Promise<NativeGeoLocation>;
}

export interface NativeGeoLocation {
  latitude: number;
  longitude: number;
  altitude: number;
  horizontalAccuracy: number;
  verticalAccuracy: number;
  isGeoTracked: boolean;
}
