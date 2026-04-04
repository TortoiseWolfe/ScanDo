import { useCallback, useState } from 'react';
import type { Vertex } from '@/types/scan';

export type MeasurementTool = 'distance' | 'area' | 'height';

export interface MeasurementPoint {
  position: Vertex;
  timestamp: number;
}

export interface Measurement {
  tool: MeasurementTool;
  points: MeasurementPoint[];
  value: number | null; // computed value in meters (or square meters for area)
  unit: string;
}

interface UseMeasurementReturn {
  activeTool: MeasurementTool | null;
  setActiveTool: (tool: MeasurementTool | null) => void;
  measurement: Measurement | null;
  startMeasurement: (point: Vertex) => void;
  addPoint: (point: Vertex) => void;
  clearMeasurement: () => void;
}

function calculateDistance(a: Vertex, b: Vertex): number {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2 + (b.z - a.z) ** 2);
}

function calculateHeight(a: Vertex, b: Vertex): number {
  return Math.abs(b.y - a.y);
}

/**
 * Compute the area of a polygon defined by 3D points using the Shoelace
 * formula projected onto the dominant plane (largest normal component).
 */
function calculateArea(points: Vertex[]): number {
  if (points.length < 3) return 0;

  // Use the cross product of first two edges to find the polygon normal
  const u = {
    x: points[1].x - points[0].x,
    y: points[1].y - points[0].y,
    z: points[1].z - points[0].z,
  };
  const v = {
    x: points[2].x - points[0].x,
    y: points[2].y - points[0].y,
    z: points[2].z - points[0].z,
  };
  const normal = {
    x: u.y * v.z - u.z * v.y,
    y: u.z * v.x - u.x * v.z,
    z: u.x * v.y - u.y * v.x,
  };

  // Project onto the plane perpendicular to the largest normal component
  const absN = {
    x: Math.abs(normal.x),
    y: Math.abs(normal.y),
    z: Math.abs(normal.z),
  };
  let area = 0;

  if (absN.x >= absN.y && absN.x >= absN.z) {
    // Project onto YZ
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].y * points[j].z - points[j].y * points[i].z;
    }
  } else if (absN.y >= absN.x && absN.y >= absN.z) {
    // Project onto XZ
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].z - points[j].x * points[i].z;
    }
  } else {
    // Project onto XY
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y - points[j].x * points[i].y;
    }
  }

  return Math.abs(area) / 2;
}

function computeValue(
  tool: MeasurementTool,
  points: MeasurementPoint[],
): number | null {
  const positions = points.map((p) => p.position);

  switch (tool) {
    case 'distance':
      return positions.length >= 2
        ? calculateDistance(positions[0], positions[positions.length - 1])
        : null;
    case 'height':
      return positions.length >= 2
        ? calculateHeight(positions[0], positions[positions.length - 1])
        : null;
    case 'area':
      return positions.length >= 3 ? calculateArea(positions) : null;
    default:
      return null;
  }
}

function unitForTool(tool: MeasurementTool): string {
  return tool === 'area' ? 'm\u00B2' : 'm';
}

export function useMeasurement(): UseMeasurementReturn {
  const [activeTool, setActiveTool] = useState<MeasurementTool | null>(null);
  const [measurement, setMeasurement] = useState<Measurement | null>(null);

  const startMeasurement = useCallback(
    (point: Vertex) => {
      if (!activeTool) return;

      const initial: Measurement = {
        tool: activeTool,
        points: [{ position: point, timestamp: Date.now() }],
        value: null,
        unit: unitForTool(activeTool),
      };
      setMeasurement(initial);
    },
    [activeTool],
  );

  const addPoint = useCallback((point: Vertex) => {
    setMeasurement((prev) => {
      if (!prev) return prev;

      const updatedPoints = [
        ...prev.points,
        { position: point, timestamp: Date.now() },
      ];
      const value = computeValue(prev.tool, updatedPoints);

      return {
        ...prev,
        points: updatedPoints,
        value,
      };
    });
  }, []);

  const clearMeasurement = useCallback(() => {
    setMeasurement(null);
  }, []);

  return {
    activeTool,
    setActiveTool,
    measurement,
    startMeasurement,
    addPoint,
    clearMeasurement,
  };
}
