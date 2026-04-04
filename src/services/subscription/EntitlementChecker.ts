import type { SubscriptionTier } from '@/types/subscription';

/**
 * Map of features to the minimum tier required.
 * Features not listed here are available to all tiers.
 */
const FEATURE_TIER_MAP: Record<string, SubscriptionTier> = {
  'multi-scan-stitching': 'pro',
  'auto-mesh-cleanup': 'pro',
  'floor-plan-generation': 'pro',
  'measurement-tools': 'pro',
  'cad-export-dwg': 'pro',
  'cad-export-ifc': 'pro',
  'cloud-backup': 'pro',
  'batch-export': 'pro',
  'scan-annotations': 'pro',
  'export-ply': 'pro',
  'export-pdf': 'pro',
  // Free features (listed for completeness)
  'basic-scan': 'free',
  'export-obj': 'free',
  'export-dae': 'free',
  'export-stl': 'free',
  'scan-library': 'free',
};

/**
 * Tier hierarchy for comparison. Higher value = more access.
 */
const TIER_RANK: Record<SubscriptionTier, number> = {
  free: 0,
  pro: 1,
};

/**
 * Check if a user with the given tier can use a specific feature.
 *
 * @param feature - Feature identifier (e.g. 'multi-scan-stitching')
 * @param tier - The user's current subscription tier
 * @returns true if the feature is available to the given tier
 */
export function canUseFeature(
  feature: string,
  tier: SubscriptionTier,
): boolean {
  const requiredTier = FEATURE_TIER_MAP[feature];

  // If the feature is not in the map, allow it by default
  if (!requiredTier) {
    return true;
  }

  return TIER_RANK[tier] >= TIER_RANK[requiredTier];
}

/**
 * Check if a feature requires a pro subscription.
 *
 * @param feature - Feature identifier
 * @returns true if the feature is gated behind pro tier
 */
export function isProFeature(feature: string): boolean {
  return FEATURE_TIER_MAP[feature] === 'pro';
}

/**
 * Get all features available to a given tier.
 */
export function getFeaturesForTier(tier: SubscriptionTier): string[] {
  return Object.entries(FEATURE_TIER_MAP)
    .filter(([, requiredTier]) => TIER_RANK[tier] >= TIER_RANK[requiredTier])
    .map(([feature]) => feature);
}

/**
 * Get all pro-only features.
 */
export function getProFeatures(): string[] {
  return Object.entries(FEATURE_TIER_MAP)
    .filter(([, requiredTier]) => requiredTier === 'pro')
    .map(([feature]) => feature);
}
