import { StateCreator } from 'zustand';
import {
  type StripeCustomer,
  type StripeSubscription,
  type StripeProduct,
} from '@/actions/stripeActions';

export type StripeAdminTab = 'customers' | 'subscriptions' | 'products';

export interface StripeAdminSlice {
  // Data
  customers: StripeCustomer[];
  subscriptions: StripeSubscription[];
  products: StripeProduct[];

  // UI State
  isLoading: boolean;
  searchTerm: string;
  activeTab: StripeAdminTab;
  isCreateCustomerOpen: boolean;

  // Computed/derived (for convenience, can be computed in component too)
  filteredCustomers: () => StripeCustomer[];
  activeSubscriptions: () => StripeSubscription[];
  totalRevenue: () => number;

  // Actions
  setCustomers: (customers: StripeCustomer[]) => void;
  setSubscriptions: (subscriptions: StripeSubscription[]) => void;
  setProducts: (products: StripeProduct[]) => void;
  setLoading: (loading: boolean) => void;
  setSearchTerm: (term: string) => void;
  setActiveTab: (tab: StripeAdminTab) => void;
  setCreateCustomerOpen: (open: boolean) => void;

  // Bulk update after API fetch
  setStripeData: (data: {
    customers?: StripeCustomer[];
    subscriptions?: StripeSubscription[];
    products?: StripeProduct[];
  }) => void;

  // Reset state
  resetStripeAdmin: () => void;
}

const initialState = {
  customers: [] as StripeCustomer[],
  subscriptions: [] as StripeSubscription[],
  products: [] as StripeProduct[],
  isLoading: true,
  searchTerm: '',
  activeTab: 'customers' as StripeAdminTab,
  isCreateCustomerOpen: false,
};

export const createStripeAdminSlice: StateCreator<
  StripeAdminSlice,
  [],
  [],
  StripeAdminSlice
> = (set, get) => ({
  ...initialState,

  // Computed getters
  filteredCustomers: () => {
    const { customers, searchTerm } = get();
    if (!searchTerm) return customers;
    const term = searchTerm.toLowerCase();
    return customers.filter(
      customer =>
        customer.name?.toLowerCase().includes(term) ||
        customer.email?.toLowerCase().includes(term) ||
        customer.id.toLowerCase().includes(term),
    );
  },

  activeSubscriptions: () => {
    const { subscriptions } = get();
    return subscriptions.filter(s => s.status === 'active');
  },

  totalRevenue: () => {
    const { subscriptions } = get();
    return subscriptions.reduce((acc, sub) => {
      const amount = sub.items?.data?.[0]?.price?.unit_amount || 0;
      return sub.status === 'active' ? acc + amount : acc;
    }, 0);
  },

  // Simple setters
  setCustomers: customers => set({ customers }),
  setSubscriptions: subscriptions => set({ subscriptions }),
  setProducts: products => set({ products }),
  setLoading: isLoading => set({ isLoading }),
  setSearchTerm: searchTerm => set({ searchTerm }),
  setActiveTab: activeTab => set({ activeTab }),
  setCreateCustomerOpen: isCreateCustomerOpen => set({ isCreateCustomerOpen }),

  // Bulk update
  setStripeData: data =>
    set(state => ({
      ...state,
      ...(data.customers !== undefined && { customers: data.customers }),
      ...(data.subscriptions !== undefined && {
        subscriptions: data.subscriptions,
      }),
      ...(data.products !== undefined && { products: data.products }),
    })),

  // Reset
  resetStripeAdmin: () => set(initialState),
});
