import { create } from 'zustand';
import type {
  SubscriptionTier,
  Entitlement,
  Product,
} from '@/types/subscription';

interface SubscriptionState {
  /** Current subscription tier. */
  tier: SubscriptionTier;
  /** Full entitlement details. */
  entitlement: Entitlement | null;
  /** Available products from the App Store. */
  products: Product[];
  /** Whether a subscription operation is in progress. */
  loading: boolean;
}

interface SubscriptionActions {
  /** Set the current entitlement (also updates tier). */
  setEntitlement: (entitlement: Entitlement) => void;
  /** Set the available products list. */
  setProducts: (products: Product[]) => void;
  /** Set the loading state. */
  setLoading: (loading: boolean) => void;
  /** Reset to free tier (e.g. on subscription expiry). */
  reset: () => void;
}

export const useSubscriptionStore = create<
  SubscriptionState & SubscriptionActions
>((set) => ({
  tier: 'free',
  entitlement: null,
  products: [],
  loading: false,

  setEntitlement: (entitlement) =>
    set({
      entitlement,
      tier: entitlement.isActive ? entitlement.tier : 'free',
    }),

  setProducts: (products) => set({ products }),

  setLoading: (loading) => set({ loading }),

  reset: () =>
    set({
      tier: 'free',
      entitlement: null,
      loading: false,
    }),
}));
