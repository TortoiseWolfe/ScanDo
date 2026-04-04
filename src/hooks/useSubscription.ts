import { useCallback, useEffect } from 'react';
import type { Product, SubscriptionTier } from '@/types/subscription';
import { useSubscriptionStore } from '@/stores/useSubscriptionStore';
import { SubscriptionService } from '@/services/subscription/SubscriptionService';

interface UseSubscriptionReturn {
  tier: SubscriptionTier;
  isProUser: boolean;
  products: Product[];
  purchase: (productId: string) => Promise<boolean>;
  restore: () => Promise<boolean>;
  loading: boolean;
}

export function useSubscription(): UseSubscriptionReturn {
  const {
    tier,
    entitlement,
    products,
    loading,
    setEntitlement,
    setProducts,
    setLoading,
  } = useSubscriptionStore();

  // Load products and entitlements on mount
  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      setLoading(true);
      try {
        const [fetchedProducts, fetchedEntitlement] = await Promise.all([
          SubscriptionService.getProducts(),
          SubscriptionService.getEntitlements(),
        ]);

        if (!cancelled) {
          setProducts(fetchedProducts);
          setEntitlement(fetchedEntitlement);
        }
      } catch (error) {
        console.error('[useSubscription] Failed to initialize:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initialize();

    return () => {
      cancelled = true;
    };
  }, [setEntitlement, setProducts, setLoading]);

  const purchase = useCallback(
    async (productId: string): Promise<boolean> => {
      setLoading(true);
      try {
        const result = await SubscriptionService.purchase(productId);
        if (result.success) {
          // Refresh entitlements after purchase
          const updatedEntitlement =
            await SubscriptionService.getEntitlements();
          setEntitlement(updatedEntitlement);
        }
        return result.success;
      } catch (error) {
        console.error('[useSubscription] Purchase failed:', error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setEntitlement, setLoading],
  );

  const restore = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      const results = await SubscriptionService.restore();
      const anyRestored = results.some((r) => r.success);
      if (anyRestored) {
        const updatedEntitlement = await SubscriptionService.getEntitlements();
        setEntitlement(updatedEntitlement);
      }
      return anyRestored;
    } catch (error) {
      console.error('[useSubscription] Restore failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setEntitlement, setLoading]);

  return {
    tier,
    isProUser: entitlement?.isActive === true && tier === 'pro',
    products,
    purchase,
    restore,
    loading,
  };
}
