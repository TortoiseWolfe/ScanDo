export interface Vertex {
  x: number;
  y: number;
  z: number;
}

export interface Face {
  a: number;
  b: number;
  c: number;
}

export interface Normal {
  x: number;
  y: number;
  z: number;
}

export interface MeshData {
  vertices: Vertex[];
  faces: Face[];
  normals: Normal[];
  vertexCount: number;
  faceCount: number;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  altitude: number; // meters above sea level
  horizontalAccuracy: number; // meters
  verticalAccuracy: number; // meters
  isGeoTracked: boolean; // true if ARGeoTrackingConfiguration was used
}

export interface ScanMetadata {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  duration: number; // seconds
  vertexCount: number;
  faceCount: number;
  fileSize: number; // bytes
  thumbnailUri?: string;
  geoLocation?: GeoLocation;
}

export interface ScanSession {
  id: string;
  state: 'idle' | 'scanning' | 'paused' | 'processing' | 'complete' | 'error';
  startedAt?: string;
  meshData?: MeshData;
  metadata?: ScanMetadata;
  error?: string;
}
