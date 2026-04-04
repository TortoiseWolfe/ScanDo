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

  const min: Vertex = { x: Infinity, y: Infinity, z: Infinity };
  const max: Vertex = { x: -Infinity, y: -Infinity, z: -Infinity };

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
 * Calculate the total surface area of a mesh by summing the areas
 * of all triangular faces.
 *
 * @returns Surface area in square units matching the vertex coordinate system
 */
export function calculateSurfaceArea(mesh: MeshData): number {
  let totalArea = 0;

  for (const face of mesh.faces) {
    const a = mesh.vertices[face.a];
    const b = mesh.vertices[face.b];
    const c = mesh.vertices[face.c];

    if (!a || !b || !c) continue;

    // Edge vectors AB and AC
    const abx = b.x - a.x;
    const aby = b.y - a.y;
    const abz = b.z - a.z;
    const acx = c.x - a.x;
    const acy = c.y - a.y;
    const acz = c.z - a.z;

    // Cross product magnitude = 2 * triangle area
    const crossX = aby * acz - abz * acy;
    const crossY = abz * acx - abx * acz;
    const crossZ = abx * acy - aby * acx;

    totalArea += 0.5 * Math.sqrt(crossX ** 2 + crossY ** 2 + crossZ ** 2);
  }

  return totalArea;
}
