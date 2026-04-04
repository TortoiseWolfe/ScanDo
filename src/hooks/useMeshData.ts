import { useCallback, useEffect, useRef, useState } from 'react';
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import type { MeshData, Vertex, Face, Normal } from '@/types/scan';
import type { NativeMeshData, ScandoLidarModule } from '@/types/native';

const LidarModule = NativeModules.ScandoLidar as ScandoLidarModule | undefined;

interface UseMeshDataReturn {
  meshData: MeshData | null;
  isReceiving: boolean;
  lastUpdateAt: string | null;
}

/**
 * Converts flat native arrays into structured MeshData.
 * Native module sends vertices/normals as [x0,y0,z0, x1,y1,z1, ...]
 * and faces as [a0,b0,c0, a1,b1,c1, ...].
 */
function parseNativeMesh(native: NativeMeshData): MeshData {
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

export function useMeshData(): UseMeshDataReturn {
  const [meshData, setMeshData] = useState<MeshData | null>(null);
  const [isReceiving, setIsReceiving] = useState(false);
  const [lastUpdateAt, setLastUpdateAt] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchSnapshot = useCallback(async () => {
    if (!LidarModule) return;

    try {
      const snapshot = await LidarModule.getMeshSnapshot();
      const parsed = parseNativeMesh(snapshot);
      setMeshData(parsed);
      setLastUpdateAt(new Date().toISOString());
      setIsReceiving(true);
    } catch {
      setIsReceiving(false);
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'ios' || !LidarModule) {
      return;
    }

    // Try to subscribe to native events if available
    try {
      const emitter = new NativeEventEmitter(NativeModules.ScandoLidar);
      const subscription = emitter.addListener(
        'onMeshUpdate',
        (event: NativeMeshData) => {
          const parsed = parseNativeMesh(event);
          setMeshData(parsed);
          setLastUpdateAt(new Date().toISOString());
          setIsReceiving(true);
        },
      );

      return () => {
        subscription.remove();
      };
    } catch {
      // Fall back to polling if event emitter is not set up
      pollingRef.current = setInterval(fetchSnapshot, 500);

      return () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
        }
      };
    }
  }, [fetchSnapshot]);

  return {
    meshData,
    isReceiving,
    lastUpdateAt,
  };
}
