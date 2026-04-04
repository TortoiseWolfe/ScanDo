import { describe, it, expect } from 'vitest';
import {
  canUseFeature,
  isProFeature,
  getFeaturesForTier,
  getProFeatures,
} from '@/services/subscription/EntitlementChecker';

describe('canUseFeature', () => {
  it('allows free users to use basic-scan', () => {
    expect(canUseFeature('basic-scan', 'free')).toBe(true);
  });

  it('denies free users access to multi-scan-stitching', () => {
    expect(canUseFeature('multi-scan-stitching', 'free')).toBe(false);
  });

  it('allows pro users to use multi-scan-stitching', () => {
    expect(canUseFeature('multi-scan-stitching', 'pro')).toBe(true);
  });

  it('allows free users to use export-obj', () => {
    expect(canUseFeature('export-obj', 'free')).toBe(true);
  });

  it('allows unknown features by default', () => {
    expect(canUseFeature('unknown-feature', 'free')).toBe(true);
  });

  it('allows pro users to use all free features', () => {
    expect(canUseFeature('basic-scan', 'pro')).toBe(true);
    expect(canUseFeature('export-obj', 'pro')).toBe(true);
    expect(canUseFeature('scan-library', 'pro')).toBe(true);
  });

  it('denies free users access to all pro features', () => {
    expect(canUseFeature('auto-mesh-cleanup', 'free')).toBe(false);
    expect(canUseFeature('cloud-backup', 'free')).toBe(false);
    expect(canUseFeature('batch-export', 'free')).toBe(false);
  });
});

describe('isProFeature', () => {
  it('returns true for cloud-backup', () => {
    expect(isProFeature('cloud-backup')).toBe(true);
  });

  it('returns true for other pro features', () => {
    expect(isProFeature('multi-scan-stitching')).toBe(true);
    expect(isProFeature('floor-plan-generation')).toBe(true);
    expect(isProFeature('measurement-tools')).toBe(true);
  });

  it('returns false for export-obj (free feature)', () => {
    expect(isProFeature('export-obj')).toBe(false);
  });

  it('returns false for unknown features', () => {
    expect(isProFeature('unknown')).toBe(false);
  });
});

describe('getFeaturesForTier', () => {
  it('returns free features for the free tier', () => {
    const features = getFeaturesForTier('free');
    expect(features).toContain('basic-scan');
    expect(features).toContain('export-obj');
    expect(features).toContain('export-dae');
    expect(features).toContain('export-stl');
    expect(features).toContain('scan-library');
  });

  it('does not include pro features in the free tier', () => {
    const features = getFeaturesForTier('free');
    expect(features).not.toContain('multi-scan-stitching');
    expect(features).not.toContain('cloud-backup');
    expect(features).not.toContain('batch-export');
  });

  it('returns all features for the pro tier', () => {
    const features = getFeaturesForTier('pro');
    expect(features).toContain('basic-scan');
    expect(features).toContain('export-obj');
    expect(features).toContain('multi-scan-stitching');
    expect(features).toContain('cloud-backup');
    expect(features).toContain('batch-export');
    expect(features).toContain('auto-mesh-cleanup');
  });

  it('returns more features for pro than for free', () => {
    const freeFeatures = getFeaturesForTier('free');
    const proFeatures = getFeaturesForTier('pro');
    expect(proFeatures.length).toBeGreaterThan(freeFeatures.length);
  });
});

describe('getProFeatures', () => {
  it('returns an array of pro-only features', () => {
    const proFeatures = getProFeatures();
    expect(proFeatures).toContain('multi-scan-stitching');
    expect(proFeatures).toContain('auto-mesh-cleanup');
    expect(proFeatures).toContain('floor-plan-generation');
    expect(proFeatures).toContain('cloud-backup');
    expect(proFeatures).toContain('batch-export');
    expect(proFeatures).toContain('scan-annotations');
  });

  it('does not include free features', () => {
    const proFeatures = getProFeatures();
    expect(proFeatures).not.toContain('basic-scan');
    expect(proFeatures).not.toContain('export-obj');
    expect(proFeatures).not.toContain('export-dae');
    expect(proFeatures).not.toContain('scan-library');
  });

  it('returns the expected count of pro features', () => {
    const proFeatures = getProFeatures();
    expect(proFeatures.length).toBe(11);
  });
});
