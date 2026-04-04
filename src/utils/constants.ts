/**
 * Minimum iOS version required for LiDAR support.
 * LiDAR was introduced on iPad Pro (2020) and iPhone 12 Pro (iOS 14+).
 */
export const LIDAR_MIN_IOS_VERSION = '14.0';

/**
 * Devices known to have LiDAR sensors.
 */
export const SUPPORTED_DEVICES = [
  // iPhones
  'iPhone 12 Pro',
  'iPhone 12 Pro Max',
  'iPhone 13 Pro',
  'iPhone 13 Pro Max',
  'iPhone 14 Pro',
  'iPhone 14 Pro Max',
  'iPhone 15 Pro',
  'iPhone 15 Pro Max',
  'iPhone 16 Pro',
  'iPhone 16 Pro Max',
  // iPads
  'iPad Pro 11-inch (2nd generation)',
  'iPad Pro 11-inch (3rd generation)',
  'iPad Pro 11-inch (4th generation)',
  'iPad Pro 12.9-inch (4th generation)',
  'iPad Pro 12.9-inch (5th generation)',
  'iPad Pro 12.9-inch (6th generation)',
  'iPad Pro 13-inch (M4)',
  'iPad Pro 11-inch (M4)',
] as const;

/**
 * Limits for each subscription tier.
 */
export const TIER_LIMITS = {
  free: {
    maxScans: 5,
    maxVerticesPerScan: 500_000,
    maxExportFormats: ['obj', 'dae', 'stl'] as const,
    cloudBackup: false,
    batchExport: false,
    measurementTools: false,
    meshCleanup: false,
  },
  pro: {
    maxScans: Infinity,
    maxVerticesPerScan: Infinity,
    maxExportFormats: [
      'obj',
      'dae',
      'stl',
      'dwg',
      'ifc',
      'ply',
      'pdf',
      'kml',
      'geojson',
    ] as const,
    cloudBackup: true,
    batchExport: true,
    measurementTools: true,
    meshCleanup: true,
  },
} as const;

/**
 * App Store product identifiers for StoreKit 2.
 */
export const PRODUCT_IDS = {
  /** Monthly pro subscription */
  proMonthly: 'com.scando.pro.monthly',
  /** Annual pro subscription */
  proAnnual: 'com.scando.pro.annual',
  /** One-time lifetime pro purchase */
  proLifetime: 'com.scando.pro.lifetime',
} as const;

/**
 * Mesh polling interval during active scanning (milliseconds).
 */
export const MESH_POLL_INTERVAL_MS = 500;

/**
 * Maximum number of recent scans to keep in memory.
 */
export const MAX_RECENT_SCANS = 20;

/**
 * App-wide animation durations (milliseconds).
 */
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;
