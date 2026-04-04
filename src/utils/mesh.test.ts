import { describe, it, expect } from 'vitest';
import {
  calculateBoundingBox,
  calculateCentroid,
  calculateSurfaceArea,
} from '@/utils/mesh';
import type { MeshData } from '@/types/scan';

function makeMesh(
  vertices: { x: number; y: number; z: number }[],
  faces: { a: number; b: number; c: number }[] = [],
): MeshData {
  return {
    vertices,
    faces,
    normals: [],
    vertexCount: vertices.length,
    faceCount: faces.length,
  };
}

describe('calculateBoundingBox', () => {
  it('returns zeros for an empty mesh', () => {
    const box = calculateBoundingBox(makeMesh([]));
    expect(box).toEqual({
      min: { x: 0, y: 0, z: 0 },
      max: { x: 0, y: 0, z: 0 },
      width: 0,
      height: 0,
      depth: 0,
    });
  });

  it('returns the vertex itself as both min and max for a single vertex', () => {
    const box = calculateBoundingBox(makeMesh([{ x: 3, y: 5, z: 7 }]));
    expect(box.min).toEqual({ x: 3, y: 5, z: 7 });
    expect(box.max).toEqual({ x: 3, y: 5, z: 7 });
    expect(box.width).toBe(0);
    expect(box.height).toBe(0);
    expect(box.depth).toBe(0);
  });

  it('computes correct min, max, width, height, and depth for multiple vertices', () => {
    const vertices = [
      { x: -1, y: 0, z: 2 },
      { x: 3, y: -4, z: 6 },
      { x: 1, y: 2, z: -3 },
    ];
    const box = calculateBoundingBox(makeMesh(vertices));
    expect(box.min).toEqual({ x: -1, y: -4, z: -3 });
    expect(box.max).toEqual({ x: 3, y: 2, z: 6 });
    expect(box.width).toBe(4); // 3 - (-1)
    expect(box.height).toBe(6); // 2 - (-4)
    expect(box.depth).toBe(9); // 6 - (-3)
  });
});

describe('calculateCentroid', () => {
  it('returns {0,0,0} for an empty mesh', () => {
    const centroid = calculateCentroid(makeMesh([]));
    expect(centroid).toEqual({ x: 0, y: 0, z: 0 });
  });

  it('returns the vertex itself for a single-vertex mesh', () => {
    const centroid = calculateCentroid(makeMesh([{ x: 4, y: -2, z: 8 }]));
    expect(centroid).toEqual({ x: 4, y: -2, z: 8 });
  });

  it('returns the average of vertices for a triangle', () => {
    const vertices = [
      { x: 0, y: 0, z: 0 },
      { x: 3, y: 0, z: 0 },
      { x: 0, y: 6, z: 0 },
    ];
    const centroid = calculateCentroid(makeMesh(vertices));
    expect(centroid.x).toBe(1); // (0+3+0)/3
    expect(centroid.y).toBe(2); // (0+0+6)/3
    expect(centroid.z).toBe(0);
  });
});

describe('calculateSurfaceArea', () => {
  it('returns 0 for a mesh with no faces', () => {
    const area = calculateSurfaceArea(makeMesh([{ x: 0, y: 0, z: 0 }]));
    expect(area).toBe(0);
  });

  it('computes area of a unit right triangle as 0.5', () => {
    const vertices = [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
    ];
    const faces = [{ a: 0, b: 1, c: 2 }];
    const area = calculateSurfaceArea(makeMesh(vertices, faces));
    expect(area).toBeCloseTo(0.5, 10);
  });

  it('computes area of a unit square (two triangles) as 1.0', () => {
    const vertices = [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 1, y: 1, z: 0 },
      { x: 0, y: 1, z: 0 },
    ];
    const faces = [
      { a: 0, b: 1, c: 2 },
      { a: 0, b: 2, c: 3 },
    ];
    const area = calculateSurfaceArea(makeMesh(vertices, faces));
    expect(area).toBeCloseTo(1.0, 10);
  });

  it('skips faces that reference out-of-bounds vertices', () => {
    const vertices = [{ x: 0, y: 0, z: 0 }];
    const faces = [{ a: 0, b: 5, c: 10 }];
    const area = calculateSurfaceArea(makeMesh(vertices, faces));
    expect(area).toBe(0);
  });
});
