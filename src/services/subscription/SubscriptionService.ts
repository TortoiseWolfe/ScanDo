import { NativeModules, Platform } from 'react-native';
import type {
  ScandoStorekitModule,
  NativePurchaseResult,
} from '@/types/native';
import type { Entitlement, Product } from '@/types/subscription';

const StoreKitModule = NativeModules.ScandoStoreKit as
  | ScandoStorekitModule
  | undefined;

function assertModule() {
  if (Platform.OS !== 'ios') {
    throw new Error('StoreKit is only available on iOS');
  }
  if (!StoreKitModule) {
    throw new Error(
      'ScandoStoreKit native module is not available. Build the native module first.',
    );
  }
}

/**
 * StoreKit 2 bridge for in-app purchases and subscriptions.
 */
export const SubscriptionService = {
  /**
   * Fetch available products from the App Store.
   */
  async getProducts(): Promise<Product[]> {
    assertModule();
    const nativeProducts = await StoreKitModule!.getProducts();

    return nativeProducts.map((np) => ({
      id: np.id,
      title: np.displayName,
      description: np.description,
      price: np.displayPrice,
      type:
        np.type === 'nonConsumable'
          ? ('lifetime' as const)
          : ('subscription' as const),
    }));
  },

  /**
   * Purchase a product by its App Store product ID.
   */
  async purchase(productId: string): Promise<NativePurchaseResult> {
    assertModule();
    return StoreKitModule!.purchase(productId);
  },

  /**
   * Restore previously purchased products.
   */
  async restore(): Promise<NativePurchaseResult[]> {
    assertModule();
    return StoreKitModule!.restorePurchases();
  },

  /**
   * Get the current user's entitlement status.
   */
  async getEntitlements(): Promise<Entitlement> {
    assertModule();
    const native = await StoreKitModule!.getEntitlements();

    return {
      tier: native.tier,
      isActive: native.isActive,
      expiresAt: native.expiresAt,
    };
  },

  /**
   * Check if StoreKit is available on this device.
   */
  get isAvailable(): boolean {
    return Platform.OS === 'ios' && StoreKitModule != null;
  },
};
