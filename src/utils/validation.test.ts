import { describe, it, expect } from 'vitest';
import {
  validateScanMetadata,
  validateExportOptions,
} from '@/utils/validation';

const validMetadata = {
  id: 'scan-001',
  name: 'Living Room',
  createdAt: '2025-06-15T10:30:00Z',
  updatedAt: '2025-06-15T11:00:00Z',
  duration: 120,
  vertexCount: 50000,
  faceCount: 100000,
  fileSize: 2048,
};

describe('validateScanMetadata', () => {
  it('returns success for valid metadata', () => {
    const result = validateScanMetadata(validMetadata);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.id).toBe('scan-001');
  });

  it('accepts metadata with optional thumbnailUri', () => {
    const result = validateScanMetadata({
      ...validMetadata,
      thumbnailUri: 'file://thumb.png',
    });
    expect(result.success).toBe(true);
  });

  it('fails when id is missing', () => {
    const { id, ...noId } = validMetadata;
    const result = validateScanMetadata(noId);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('fails when id is an empty string', () => {
    const result = validateScanMetadata({ ...validMetadata, id: '' });
    expect(result.success).toBe(false);
  });

  it('fails when duration is negative', () => {
    const result = validateScanMetadata({ ...validMetadata, duration: -5 });
    expect(result.success).toBe(false);
  });

  it('fails when createdAt is not a valid datetime', () => {
    const result = validateScanMetadata({
      ...validMetadata,
      createdAt: 'not-a-date',
    });
    expect(result.success).toBe(false);
  });

  it('fails when name exceeds 100 characters', () => {
    const result = validateScanMetadata({
      ...validMetadata,
      name: 'a'.repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it('fails when vertexCount is a float', () => {
    const result = validateScanMetadata({
      ...validMetadata,
      vertexCount: 1.5,
    });
    expect(result.success).toBe(false);
  });
});

describe('validateExportOptions', () => {
  const validExport = {
    format: 'obj',
    scanId: 'scan-001',
  };

  it('returns success for valid OBJ export options', () => {
    const result = validateExportOptions(validExport);
    expect(result.success).toBe(true);
    expect(result.data?.format).toBe('obj');
  });

  it('accepts all valid format values', () => {
    const formats = ['obj', 'dae', 'stl', 'dwg', 'ifc', 'ply', 'pdf'];
    for (const format of formats) {
      const result = validateExportOptions({ ...validExport, format });
      expect(result.success).toBe(true);
    }
  });

  it('fails for an invalid format', () => {
    const result = validateExportOptions({ ...validExport, format: 'fbx' });
    expect(result.success).toBe(false);
  });

  it('fails when scanId is missing', () => {
    const { scanId, ...noScanId } = validExport;
    const result = validateExportOptions(noScanId);
    expect(result.success).toBe(false);
  });

  it('fails when scanId is an empty string', () => {
    const result = validateExportOptions({ ...validExport, scanId: '' });
    expect(result.success).toBe(false);
  });

  it('fails when fileName contains special characters', () => {
    const result = validateExportOptions({
      ...validExport,
      fileName: 'file@name!.obj',
    });
    expect(result.success).toBe(false);
  });

  it('accepts a valid fileName', () => {
    const result = validateExportOptions({
      ...validExport,
      fileName: 'my-scan_export.obj',
    });
    expect(result.success).toBe(true);
  });

  it('accepts optional boolean flags', () => {
    const result = validateExportOptions({
      ...validExport,
      simplifyMesh: true,
      includeTextures: false,
    });
    expect(result.success).toBe(true);
  });
});
