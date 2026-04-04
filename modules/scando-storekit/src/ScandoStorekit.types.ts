export interface ScandoStorekitModuleInterface {
  getProducts(): Promise<NativeProduct[]>;
  purchase(productId: string): Promise<NativePurchaseResult>;
  restorePurchases(): Promise<NativePurchaseResult[]>;
  getEntitlements(): Promise<NativeEntitlement>;
}

export interface NativeProduct {
  id: string;
  displayName: string;
  description: string;
  displayPrice: string;
  type: 'autoRenewable' | 'nonRenewable' | 'nonConsumable';
}

export interface NativePurchaseResult {
  success: boolean;
  productId: string;
  transactionId?: string;
  error?: string;
}

export interface NativeEntitlement {
  tier: 'free' | 'pro';
  isActive: boolean;
  expiresAt?: string;
  purchaseType?: 'subscription' | 'lifetime';
}
