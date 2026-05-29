'use client';

import { CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import type { StripeCardNumberElementChangeEvent, StripeCardExpiryElementChangeEvent, StripeCardCvcElementChangeEvent } from '@stripe/stripe-js';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

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
}

export function StripeCardForm({
  onCardComplete,
  onError,
  onReady,
  className,
  showPostalCode = false,
}: StripeCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [cardError, setCardError] = useState<string>('');
  
  const [numberComplete, setNumberComplete] = useState(false);
  const [expiryComplete, setExpiryComplete] = useState(false);
  const [cvcComplete, setCvcComplete] = useState(false);
  
  const isCardComplete = numberComplete && expiryComplete && cvcComplete;
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Notify parent on completion change
  useEffect(() => {
    onCardComplete?.(isCardComplete);
  }, [isCardComplete, onCardComplete]);

  // CardElement styling options
  const baseElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: 'hsl(var(--foreground))',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: 'hsl(var(--muted-foreground))',
          fontWeight: '300',
        },
        iconColor: 'hsl(var(--muted-foreground))',
      },
      invalid: {
        color: 'hsl(var(--destructive))',
        iconColor: 'hsl(var(--destructive))',
      },
      complete: {
        color: 'hsl(var(--foreground))',
        iconColor: 'hsl(var(--primary))',
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
    <div className={cn('space-y-1', className)}>
      {/* Card Input Section */}
      <div className="flex flex-col">
        <div
          className={cn(
            'relative flex items-center rounded-md border-2 transition-colors overflow-hidden',
            isFocused
              ? 'border-primary ring-primary/20 ring-2'
              : cardError
                ? 'border-destructive'
                : isCardComplete
                  ? 'border-green-500'
                  : 'border-input',
            'bg-background'
          )}
        >
          <div className="flex-1 px-3 py-3">
            <CardNumberElement
              id="card-number-element"
              options={{ ...baseElementOptions, showIcon: true, placeholder: 'Card Number' }}
              onChange={(e: StripeCardNumberElementChangeEvent) => {
                handleError(e.error);
                setNumberComplete(e.complete);
              }}
              onReady={handleCardReady}
              onFocus={() => setFocusedField('number')}
              onBlur={() => setFocusedField(null)}
            />
          </div>
          <div className="w-[85px] px-3 py-3">
            <CardExpiryElement
              id="card-expiry-element"
              options={baseElementOptions}
              onChange={(e: StripeCardExpiryElementChangeEvent) => {
                handleError(e.error);
                setExpiryComplete(e.complete);
              }}
              onFocus={() => setFocusedField('expiry')}
              onBlur={() => setFocusedField(null)}
            />
          </div>
          <div className="w-[80px] px-3 py-3">
            <CardCvcElement
              id="card-cvc-element"
              options={baseElementOptions}
              onChange={(e: StripeCardCvcElementChangeEvent) => {
                handleError(e.error);
                setCvcComplete(e.complete);
              }}
              onFocus={() => setFocusedField('cvc')}
              onBlur={() => setFocusedField(null)}
            />
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
