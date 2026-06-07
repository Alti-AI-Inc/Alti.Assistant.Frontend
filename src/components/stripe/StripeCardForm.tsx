'use client';

import { CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import type { StripeCardNumberElementChangeEvent, StripeCardExpiryElementChangeEvent, StripeCardCvcElementChangeEvent } from '@stripe/stripe-js';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useStripeAvailability } from './StripeProvider';

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
  const { isAvailable, status, message, retry } = useStripeAvailability();

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
        fontSize: '14px', // matches text-sm exactly on all viewports
        color: isDark ? '#fafafa' : '#09090b', // zinc-50 in dark, zinc-955 in light
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: isDark ? '#a1a1aa' : '#71717a', // zinc-400 in dark, zinc-500 in light
          fontWeight: '400',
        },
        iconColor: isDark ? '#a1a1aa' : '#71717a',
      },
      invalid: {
        color: '#ef4444', // destructive red-500
        iconColor: '#ef4444',
      },
      complete: {
        color: isDark ? '#fafafa' : '#09090b',
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
    if (!isAvailable) {
      onError?.('');
      return;
    }
    if (!stripe || !elements) {
      const message = 'Payment system is initializing...';
      onError?.(message);
    }
  }, [stripe, elements, isAvailable, onError]);

  const isFocused = focusedField !== null;

  return (
    <div className={cn('space-y-4 py-2', className)}>
      <div className="space-y-4">
        {/* Error Banner when Stripe is not available */}
        {!isAvailable && status === 'error' && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                  Payment System Configured in Degraded Mode
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-450 leading-relaxed">
                  {message || 'Failed to initialize payment gateway. Please check your Stripe keys.'}
                </p>
                {retry && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      retry();
                    }}
                    className="mt-2 text-xs font-semibold text-amber-900 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    Retry connection
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Row 1: Cardholder Name & Card Number in 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="cardholder-name"
            type="text"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            placeholder="Enter Cardholder Name"
            disabled={disabled || !isAvailable}
            className="h-10 text-sm font-sans text-[#09090b] dark:text-[#fafafa] placeholder:text-[#71717a] dark:placeholder:text-[#a1a1aa] border border-zinc-200 dark:border-zinc-800 !bg-white dark:!bg-zinc-900 focus:!bg-white dark:focus:!bg-zinc-900 focus-visible:!bg-white dark:focus-visible:!bg-zinc-900 active:!bg-white dark:active:!bg-zinc-900 autofill:!bg-white dark:autofill:!bg-zinc-900 autofill:shadow-[0_0_0_1000px_white_inset] dark:autofill:shadow-[0_0_0_1000px_#18181b_inset] focus:outline-none focus-visible:outline-none focus:ring-1 focus:ring-black/20 focus:shadow-sm focus-visible:ring-1 focus-visible:ring-black/20 focus-visible:shadow-sm rounded-lg"
          />

          <div
            className={cn(
              "flex h-10 w-full min-w-0 rounded-lg border bg-white dark:bg-zinc-900 px-3 shadow-xs transition-all outline-none items-center",
              !isAvailable
                ? "border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 opacity-60 cursor-not-allowed"
                : focusedField === 'number'
                  ? "border-zinc-300 dark:border-zinc-700 ring-1 ring-black/20 dark:ring-white/20 shadow-sm"
                  : cardError && focusedField === null
                    ? "border-destructive"
                    : isCardComplete
                      ? "border-green-500"
                      : "border-zinc-200 dark:border-zinc-800"
            )}
          >
            <div className="flex-1">
              {isAvailable ? (
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
              ) : (
                <input
                  type="text"
                  disabled
                  placeholder="Card Number (Unavailable)"
                  className="w-full bg-transparent border-0 outline-none text-sm text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
                />
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Expiration Date and CCV in 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={cn(
              "flex h-10 w-full min-w-0 rounded-lg border bg-white dark:bg-zinc-900 px-3 shadow-xs transition-all outline-none items-center",
              !isAvailable
                ? "border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 opacity-60 cursor-not-allowed"
                : focusedField === 'expiry'
                  ? "border-zinc-300 dark:border-zinc-700 ring-1 ring-black/20 dark:ring-white/20 shadow-sm"
                  : "border-zinc-200 dark:border-zinc-800"
            )}
          >
            <div className="flex-1">
              {isAvailable ? (
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
              ) : (
                <input
                  type="text"
                  disabled
                  placeholder="MM / YY"
                  className="w-full bg-transparent border-0 outline-none text-sm text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
                />
              )}
            </div>
          </div>

          <div
            className={cn(
              "flex h-10 w-full min-w-0 rounded-lg border bg-white dark:bg-zinc-900 px-3 shadow-xs transition-all outline-none items-center",
              !isAvailable
                ? "border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 opacity-60 cursor-not-allowed"
                : focusedField === 'cvc'
                  ? "border-zinc-300 dark:border-zinc-700 ring-1 ring-black/20 dark:ring-white/20 shadow-sm"
                  : "border-zinc-200 dark:border-zinc-800"
            )}
          >
            <div className="flex-1">
              {isAvailable ? (
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
              ) : (
                <input
                  type="text"
                  disabled
                  placeholder="CVC"
                  className="w-full bg-transparent border-0 outline-none text-sm text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
                />
              )}
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
