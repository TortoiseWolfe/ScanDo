import type { MeshData, Vertex } from '@/types/scan';

export interface BoundingBox {
  min: Vertex;
  max: Vertex;
  width: number;
  height: number;
  depth: number;
}

/**
 * Calculate the axis-aligned bounding box of a mesh.
 */
export function calculateBoundingBox(mesh: MeshData): BoundingBox {
  if (mesh.vertices.length === 0) {
    return {
      min: { x: 0, y: 0, z: 0 },
      max: { x: 0, y: 0, z: 0 },
      width: 0,
      height: 0,
      depth: 0,
    };
  }

  const min: Vertex = {
    x: Infinity,
    y: Infinity,
    z: Infinity,
  };
  const max: Vertex = {
    x: -Infinity,
    y: -Infinity,
    z: -Infinity,
  };

  for (const v of mesh.vertices) {
    if (v.x < min.x) min.x = v.x;
    if (v.y < min.y) min.y = v.y;
    if (v.z < min.z) min.z = v.z;
    if (v.x > max.x) max.x = v.x;
    if (v.y > max.y) max.y = v.y;
    if (v.z > max.z) max.z = v.z;
  }

  return {
    min,
    max,
    width: max.x - min.x,
    height: max.y - min.y,
    depth: max.z - min.z,
  };
}

/**
 * Calculate the centroid (geometric center) of a mesh.
 */
export function calculateCentroid(mesh: MeshData): Vertex {
  if (mesh.vertices.length === 0) {
    return { x: 0, y: 0, z: 0 };
  }

  let sumX = 0;
  let sumY = 0;
  let sumZ = 0;

  for (const v of mesh.vertices) {
    sumX += v.x;
    sumY += v.y;
    sumZ += v.z;
  }

  const count = mesh.vertices.length;
  return {
    x: sumX / count,
    y: sumY / count,
    z: sumZ / count,
  };
}

/**
 * Stub for mesh decimation. In production this would reduce the polygon
 * count while preserving shape fidelity using an algorithm like
 * quadric error metrics.
 *
 * @param mesh - Input mesh data
 * @param targetRatio - Target ratio of faces to keep (0-1)
 * @returns Decimated mesh (currently returns input unchanged)
 */
export function decimateMesh(mesh: MeshData, targetRatio: number): MeshData {
  if (targetRatio < 0 || targetRatio > 1) {
    throw new Error(`targetRatio must be between 0 and 1, got ${targetRatio}`);
  }

  // TODO: Implement quadric error metric decimation
  // For now, return the mesh unchanged
  console.warn(
    `[MeshProcessor] decimateMesh is a stub. Requested ${Math.round(targetRatio * 100)}% retention, returning original mesh.`,
  );

  return { ...mesh };
}

/**
 * Calculate the total surface area of a mesh by summing triangle areas.
 */
export function calculateSurfaceArea(mesh: MeshData): number {
  let totalArea = 0;

  for (const face of mesh.faces) {
    const a = mesh.vertices[face.a];
    const b = mesh.vertices[face.b];
    const c = mesh.vertices[face.c];

    if (!a || !b || !c) continue;

    // Cross product of edges AB and AC
    const abx = b.x - a.x;
    const aby = b.y - a.y;
    const abz = b.z - a.z;
    const acx = c.x - a.x;
    const acy = c.y - a.y;
    const acz = c.z - a.z;

    const crossX = aby * acz - abz * acy;
    const crossY = abz * acx - abx * acz;
    const crossZ = abx * acy - aby * acx;

    const triangleArea =
      0.5 * Math.sqrt(crossX * crossX + crossY * crossY + crossZ * crossZ);
    totalArea += triangleArea;
  }

  return totalArea;
}
