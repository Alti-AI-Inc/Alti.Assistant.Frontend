'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

/**
 * Stripe Provider Component
 * Initializes Stripe.js and provides Elements context to child components
 */

let stripePromise: Promise<Stripe | null> | null = null;

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      console.error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
      return null;
    }

    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

interface StripeProviderProps {
  children: React.ReactNode;
}

export function StripeProvider({ children }: StripeProviderProps) {
  const [stripe, setStripe] = useState<Promise<Stripe | null> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stripeInstance = getStripe();
      
      if (!stripeInstance) {
        setError('Failed to initialize Stripe. Check your environment configuration.');
        return;
      }

      setStripe(stripeInstance);

      // Verify Stripe loaded successfully
      stripeInstance.then((stripe) => {
        if (!stripe) {
          setError('Stripe failed to load. Please check your publishable key.');
        }
      }).catch((err) => {
        console.error('Stripe initialization error:', err);
        setError('Failed to initialize payment provider.');
      });
    } catch (err) {
      console.error('Error setting up Stripe:', err);
      setError('Payment provider setup failed.');
    }
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-destructive text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!stripe) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-muted-foreground text-sm">
          Loading payment provider...
        </div>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripe}
      options={{
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#0570de',
            colorBackground: '#ffffff',
            colorText: '#30313d',
            colorDanger: '#df1b41',
            fontFamily: 'system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '6px',
          },
        },
        loader: 'auto',
      }}
    >
      {children}
    </Elements>
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
          <div className="text-destructive font-semibold mb-2">
            Payment System Error
          </div>
          <div className="text-muted-foreground text-sm max-w-md">
            We encountered an issue with the payment system. Please refresh the page and try again.
            If the problem persists, contact support.
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Import React for error boundary
import React from 'react';

/**
 * Combined Stripe Provider with Error Boundary
 * Use this as the main export for wrapping payment-related components
 */
export function StripeProviderWithErrorBoundary({ children }: StripeProviderProps) {
  return (
    <StripeErrorBoundary>
      <StripeProvider>{children}</StripeProvider>
    </StripeErrorBoundary>
  );
}

export default StripeProviderWithErrorBoundary;
