import { create } from 'zustand';
import {
  StripeAdminSlice,
  createStripeAdminSlice,
} from './slices/createStripeAdminSlice';

// Re-export types for convenience
export type {
  StripeAdminSlice,
  StripeAdminTab,
} from './slices/createStripeAdminSlice';

export const useStripeAdminStore = create<StripeAdminSlice>()((...a) => ({
  ...createStripeAdminSlice(...a),
}));
