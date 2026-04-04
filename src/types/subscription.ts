export type SubscriptionTier = 'free' | 'pro';

export interface Entitlement {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt?: string;
  purchaseType?: 'subscription' | 'lifetime';
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  type: 'subscription' | 'lifetime';
}

export const PRO_FEATURES = [
  'Multi-scan stitching',
  'Auto mesh cleanup',
  'Floor plan generation',
  'Measurement tools',
  'CAD-ready export (DWG, IFC)',
  'Geolocation tagging + geo export (KML, GeoJSON)',
  'Cloud backup',
  'Batch export',
  'Scan annotations',
] as const;
