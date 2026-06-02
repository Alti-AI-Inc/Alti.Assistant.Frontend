'use client';

import { CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import type { StripeCardNumberElementChangeEvent, StripeCardExpiryElementChangeEvent, StripeCardCvcElementChangeEvent } from '@stripe/stripe-js';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

/**
 * Stripe Card Form Component
 * Provides a secure card input field using Stripe Elements
 */

interface StripeCardFormProps {
  onCardComplete?: (isComplete: boolean) => void;
  onError?: (error: string) => void;
  onReady?: () => void;
  className?: string;
  showPostalCode?: boolean;
  onCardholderNameChange?: (name: string) => void;
  disabled?: boolean;
}

export function StripeCardForm({
  onCardComplete,
  onError,
  onReady,
  className,
  showPostalCode = false,
  onCardholderNameChange,
  disabled = false,
}: StripeCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [cardError, setCardError] = useState<string>('');
  const [cardholderName, setCardholderName] = useState('');
  
  const [numberComplete, setNumberComplete] = useState(false);
  const [expiryComplete, setExpiryComplete] = useState(false);
  const [cvcComplete, setCvcComplete] = useState(false);
  
  const isCardComplete = numberComplete && expiryComplete && cvcComplete && cardholderName.trim().length > 0;
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Detect and track application dark mode theme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkDark = () => {
        setIsDark(document.documentElement.classList.contains('dark'));
      };
      checkDark();
      
      const observer = new MutationObserver(checkDark);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
      return () => observer.disconnect();
    }
  }, []);

  // Notify parent on completion change
  useEffect(() => {
    onCardComplete?.(isCardComplete);
  }, [isCardComplete, onCardComplete]);

  // Notify parent on cardholder name change
  useEffect(() => {
    onCardholderNameChange?.(cardholderName);
  }, [cardholderName, onCardholderNameChange]);

  // CardElement styling options - dynamic hex fallback since iframe cannot access parent document css variables
  const baseElementOptions = {
    style: {
      base: {
        fontSize: '12px',
        color: isDark ? '#f4f4f5' : '#18181b', // zinc-100 in dark, zinc-900 in light
        fontFamily: '"Exo 2", system-ui, -apple-system, sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: isDark ? '#71717a' : '#9ca3af', // zinc-500 in dark, gray-400 in light
          fontWeight: '400',
        },
        iconColor: isDark ? '#71717a' : '#9ca3af',
        '@media (min-width: 768px)': {
          fontSize: '14px', // matches md:text-sm exactly on desktop viewports
        },
      },
      invalid: {
        color: '#ef4444', // destructive red-500
        iconColor: '#ef4444',
      },
      complete: {
        color: isDark ? '#f4f4f5' : '#18181b',
        iconColor: '#10b981', // emerald-500 (emerald green)
      },
    },
    disableLink: true,
  };

  const handleError = (error?: { message: string }) => {
    if (error) {
      setCardError(error.message);
      onError?.(error.message);
    } else {
      setCardError('');
      onError?.('');
    }
  };

  // Handle card element ready event
  const handleCardReady = () => {
    setTimeout(() => {
      onReady?.();
    }, 100);
  };

  // Notify parent when Stripe is not ready
  useEffect(() => {
    if (!stripe || !elements) {
      const message = 'Payment system is initializing...';
      onError?.(message);
    }
  }, [stripe, elements, onError]);

  const isFocused = focusedField !== null;

  return (
    <div className={cn('space-y-4 py-2', className)}>
      <div className="space-y-4">
        
        {/* Row 1: Cardholder Name & Card Number in 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="cardholder-name"
            type="text"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            placeholder="Enter Cardholder Name"
            disabled={disabled}
            className="h-10 text-xs md:text-sm border border-zinc-200 dark:border-zinc-800 !bg-white dark:!bg-zinc-900 focus:!bg-white dark:focus:!bg-zinc-900 focus-visible:!bg-white dark:focus-visible:!bg-zinc-900 active:!bg-white dark:active:!bg-zinc-900 autofill:!bg-white dark:autofill:!bg-zinc-900 autofill:shadow-[0_0_0_1000px_white_inset] dark:autofill:shadow-[0_0_0_1000px_#18181b_inset] focus:outline-none focus-visible:outline-none focus:ring-1 focus:ring-black/20 focus:shadow-sm focus-visible:ring-1 focus-visible:ring-black/20 focus-visible:shadow-sm rounded-lg"
          />

          <div
            className={cn(
              "flex h-10 w-full min-w-0 rounded-lg border bg-white dark:bg-zinc-900 px-3 py-2 text-xs md:text-sm shadow-xs transition-all outline-none items-center",
              focusedField === 'number'
                ? "border-zinc-300 dark:border-zinc-700 ring-1 ring-black/20 dark:ring-white/20 shadow-sm"
                : cardError && focusedField === null
                  ? "border-destructive"
                  : isCardComplete
                    ? "border-green-500"
                    : "border-zinc-200 dark:border-zinc-800"
            )}
          >
            <div className="flex-1">
              <CardNumberElement
                id="card-number"
                options={{ ...baseElementOptions, showIcon: false, placeholder: 'Enter Card Number' }}
                onChange={(e: StripeCardNumberElementChangeEvent) => {
                  handleError(e.error);
                  setNumberComplete(e.complete);
                }}
                onReady={handleCardReady}
                onFocus={() => setFocusedField('number')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Expiration Date and CCV in 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={cn(
              "flex h-10 w-full min-w-0 rounded-lg border bg-white dark:bg-zinc-900 px-3 py-2 text-xs md:text-sm shadow-xs transition-all outline-none items-center",
              focusedField === 'expiry'
                ? "border-zinc-300 dark:border-zinc-700 ring-1 ring-black/20 dark:ring-white/20 shadow-sm"
                : "border-zinc-200 dark:border-zinc-800"
            )}
          >
            <div className="flex-1">
              <CardExpiryElement
                id="card-expiry"
                options={{ ...baseElementOptions, placeholder: 'MM / YY' }}
                onChange={(e: StripeCardExpiryElementChangeEvent) => {
                  handleError(e.error);
                  setExpiryComplete(e.complete);
                }}
                onFocus={() => setFocusedField('expiry')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>

          <div
            className={cn(
              "flex h-10 w-full min-w-0 rounded-lg border bg-white dark:bg-zinc-900 px-3 py-2 text-xs md:text-sm shadow-xs transition-all outline-none items-center",
              focusedField === 'cvc'
                ? "border-zinc-300 dark:border-zinc-700 ring-1 ring-black/20 dark:ring-white/20 shadow-sm"
                : "border-zinc-200 dark:border-zinc-800"
            )}
          >
            <div className="flex-1">
              <CardCvcElement
                id="card-cvc"
                options={{ ...baseElementOptions, placeholder: 'CVC' }}
                onChange={(e: StripeCardCvcElementChangeEvent) => {
                  handleError(e.error);
                  setCvcComplete(e.complete);
                }}
                onFocus={() => setFocusedField('cvc')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {cardError && (
          <div className="text-destructive mt-2 flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{cardError}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Hook to access card form validation
 * Use this in parent components to check if the card is ready for submission
 */
export function useCardValidation() {
  const stripe = useStripe();
  const elements = useElements();
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string>('');

  const validateCard = async (): Promise<boolean> => {
    if (!stripe || !elements) {
      setError('Payment system not initialized');
      return false;
    }

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      setError('Card input not found');
      return false;
    }

    // Stripe will validate on submission, but we can check basic state
    try {
      // This will trigger validation
      const { error: submitError } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (submitError) {
        setError(submitError.message || 'Invalid card');
        setIsValid(false);
        return false;
      }

      setError('');
      setIsValid(true);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Validation failed';
      setError(message);
      setIsValid(false);
      return false;
    }
  };

  return {
    isValid,
    error,
    validateCard,
    stripe,
    elements,
  };
}

export default StripeCardForm;
