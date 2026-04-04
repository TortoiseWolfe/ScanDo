import { NativeModules, Platform } from 'react-native';
import type { ScandoLidarModule, NativeMeshData } from '@/types/native';
import type { MeshData, Vertex, Face, Normal } from '@/types/scan';

const LidarModule = NativeModules.ScandoLidar as ScandoLidarModule | undefined;

/**
 * Singleton service that orchestrates the native LiDAR scanner module.
 * All scan lifecycle operations flow through this class.
 */
class ScannerServiceImpl {
  private static _instance: ScannerServiceImpl;
  private _isSessionActive = false;

  private constructor() {}

  static get instance(): ScannerServiceImpl {
    if (!ScannerServiceImpl._instance) {
      ScannerServiceImpl._instance = new ScannerServiceImpl();
    }
    return ScannerServiceImpl._instance;
  }

  get isAvailable(): boolean {
    if (Platform.OS !== 'ios') return false;
    if (!LidarModule) return false;
    try {
      return LidarModule.isLidarAvailable();
    } catch {
      return false;
    }
  }

  get isSessionActive(): boolean {
    return this._isSessionActive;
  }

  async startSession(): Promise<void> {
    this.assertModule();
    if (this._isSessionActive) {
      throw new Error('A scan session is already active');
    }
    await LidarModule!.startSession();
    this._isSessionActive = true;
  }

  async stopSession(): Promise<MeshData> {
    this.assertModule();
    if (!this._isSessionActive) {
      throw new Error('No active scan session to stop');
    }

    // Grab final mesh snapshot before stopping
    const snapshot = await LidarModule!.getMeshSnapshot();
    await LidarModule!.stopSession();
    this._isSessionActive = false;

    return this.parseMesh(snapshot);
  }

  async pauseSession(): Promise<void> {
    this.assertModule();
    await LidarModule!.pauseSession();
  }

  async resumeSession(): Promise<void> {
    this.assertModule();
    await LidarModule!.resumeSession();
  }

  async getMeshSnapshot(): Promise<MeshData> {
    this.assertModule();
    const snapshot = await LidarModule!.getMeshSnapshot();
    return this.parseMesh(snapshot);
  }

  async exportMesh(format: string, outputPath: string): Promise<string> {
    this.assertModule();
    return LidarModule!.exportToFile(format, outputPath);
  }

  private assertModule(): asserts this is { isAvailable: true } {
    if (Platform.OS !== 'ios') {
      throw new Error('LiDAR scanning is only available on iOS');
    }
    if (!LidarModule) {
      throw new Error(
        'ScandoLidar native module is not available. Build the native module first.',
      );
    }
  }

  private parseMesh(native: NativeMeshData): MeshData {
    const vertices: Vertex[] = [];
    for (let i = 0; i < native.vertices.length; i += 3) {
      vertices.push({
        x: native.vertices[i],
        y: native.vertices[i + 1],
        z: native.vertices[i + 2],
      });
    }

    const faces: Face[] = [];
    for (let i = 0; i < native.faces.length; i += 3) {
      faces.push({
        a: native.faces[i],
        b: native.faces[i + 1],
        c: native.faces[i + 2],
      });
    }

    const normals: Normal[] = [];
    for (let i = 0; i < native.normals.length; i += 3) {
      normals.push({
        x: native.normals[i],
        y: native.normals[i + 1],
        z: native.normals[i + 2],
      });
    }

    return {
      vertices,
      faces,
      normals,
      vertexCount: native.vertexCount,
      faceCount: native.faceCount,
    };
  }
}

export const ScannerService = ScannerServiceImpl.instance;
