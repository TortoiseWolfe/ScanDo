export interface EventSubscription {
  remove(): void;
}

export interface ScandoLidarModuleInterface {
  startSession(): Promise<void>;
  stopSession(): Promise<void>;
  pauseSession(): Promise<void>;
  resumeSession(): Promise<void>;
  getMeshSnapshot(): Promise<NativeMeshSnapshot>;
  exportToFile(format: string, outputPath: string): Promise<string>;
  isLidarAvailable(): boolean;
  addListener(
    eventName: 'onMeshUpdate',
    listener: (event: MeshUpdateEvent) => void,
  ): EventSubscription;
  addListener(
    eventName: 'onSessionStateChange',
    listener: (event: SessionStateChangeEvent) => void,
  ): EventSubscription;
  addListener(
    eventName: 'onError',
    listener: (event: LidarErrorEvent) => void,
  ): EventSubscription;
}

export interface NativeMeshSnapshot {
  vertices: number[];
  faces: number[];
  normals: number[];
  vertexCount: number;
  faceCount: number;
}

export interface MeshUpdateEvent {
  anchorId: string;
  vertices: number[];
  faces: number[];
  normals: number[];
  vertexCount: number;
  faceCount: number;
}

export interface SessionStateChangeEvent {
  state: 'running' | 'paused' | 'stopped' | 'error';
  message?: string;
}

export interface LidarErrorEvent {
  code: string;
  message: string;
}
