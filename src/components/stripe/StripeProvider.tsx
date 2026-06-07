'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useEffect, useState, useCallback, createContext, useContext } from 'react';
import { getStripePublishableKey } from '@/actions/stripeActions';
import React from 'react';

export interface StripeAvailability {
  status: 'loading' | 'ready' | 'error';
  message?: string;
  isAvailable: boolean;
  retry?: () => void;
}

const StripeAvailabilityContext = createContext<StripeAvailability>({
  status: 'loading',
  isAvailable: false,
});

export const useStripeAvailability = () => useContext(StripeAvailabilityContext);

/**
 * Stripe Provider Component
 * Initializes Stripe.js and provides Elements context to child components.
 *
 * Key resolution strategy:
 * 1. Try NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (baked at build time)
 * 2. If missing/placeholder, call server action to get runtime key
 * 3. Validate key starts with 'pk_' before loading Stripe
 */

interface StripeProviderProps {
  children: React.ReactNode;
}

type StripeState =
  | { status: 'loading' }
  | { status: 'ready'; stripe: Promise<Stripe | null> }
  | { status: 'error'; message: string };

function isValidStripeKey(key: string | undefined | null): key is string {
  if (!key) return false;
  if (key === 'undefined' || key === 'null') return false;
  if (key.includes('placeholder')) return false;
  if (!key.startsWith('pk_')) return false;
  return true;
}

export function StripeProvider({ children }: StripeProviderProps) {
  const [state, setState] = useState<StripeState>({ status: 'loading' });

  const initStripe = useCallback(async () => {
    setState({ status: 'loading' });

    try {
      // Step 1: Try the build-time NEXT_PUBLIC key
      let key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

      // Step 2: If invalid, ask the server for the runtime key
      if (!isValidStripeKey(key)) {
        console.info('[StripeProvider] Build-time key unavailable, fetching from server...');
        try {
          const res = await getStripePublishableKey();
          if (res.success && res.data) {
            key = res.data;
          } else {
            console.warn('[StripeProvider] Server action returned:', res.message);
          }
        } catch (fetchErr) {
          console.warn('[StripeProvider] Server action failed:', fetchErr);
        }
      }

      // Step 3: Final validation
      if (!isValidStripeKey(key)) {
        setState({
          status: 'error',
          message: 'Stripe payment system is not configured. Please contact your administrator to set up the Stripe publishable key.',
        });
        return;
      }

      // Step 4: Load Stripe
      const stripePromise = loadStripe(key);
      const instance = await stripePromise;

      if (!instance) {
        setState({
          status: 'error',
          message: 'Failed to initialize Stripe. The publishable key may be invalid or expired.',
        });
        return;
      }

      // Re-create the promise since the resolved one can still be used
      setState({ status: 'ready', stripe: loadStripe(key) });
    } catch (err: any) {
      console.error('[StripeProvider] Initialization error:', err);
      setState({
        status: 'error',
        message: err?.message || 'An unexpected error occurred while initializing the payment system.',
      });
    }
  }, []);

  useEffect(() => {
    initStripe();
  }, [initStripe]);

  if (state.status === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300" />
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Initializing payment system...
          </div>
        </div>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <StripeAvailabilityContext.Provider
        value={{
          status: 'error',
          message: state.message,
          isAvailable: false,
          retry: initStripe,
        }}
      >
        <Elements stripe={null}>
          {children}
        </Elements>
      </StripeAvailabilityContext.Provider>
    );
  }

  return (
    <StripeAvailabilityContext.Provider
      value={{
        status: 'ready',
        isAvailable: true,
        retry: initStripe,
      }}
    >
      <Elements
        stripe={state.stripe}
        options={{
          fonts: [
            {
              cssSrc: 'https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100..900;1,100..900&display=swap',
            },
          ],
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#0570de',
              colorBackground: '#ffffff',
              colorText: '#30313d',
              colorDanger: '#df1b41',
              fontFamily: '"Exo 2", system-ui, sans-serif',
              spacingUnit: '4px',
              borderRadius: '6px',
            },
          },
          loader: 'auto',
        }}
      >
        {children}
      </Elements>
    </StripeAvailabilityContext.Provider>
  );
}

/**
 * Error Boundary for Stripe Provider
 * Catches errors during payment processing and displays user-friendly messages
 */
interface StripeErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface StripeErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class StripeErrorBoundary extends React.Component<
  StripeErrorBoundaryProps,
  StripeErrorBoundaryState
> {
  constructor(props: StripeErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): StripeErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Stripe Error Boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-destructive mb-2 font-semibold">
            Payment System Error
          </div>
          <div className="text-muted-foreground max-w-md text-sm">
            We encountered an issue with the payment system. Please refresh the
            page and try again. If the problem persists, contact support.
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-md px-4 py-2"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Combined Stripe Provider with Error Boundary
 * Use this as the main export for wrapping payment-related components
 */
export function StripeProviderWithErrorBoundary({
  children,
}: StripeProviderProps) {
  return (
    <StripeErrorBoundary>
      <StripeProvider>{children}</StripeProvider>
    </StripeErrorBoundary>
  );
}

export default StripeProviderWithErrorBoundary;
