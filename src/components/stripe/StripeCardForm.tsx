'use client';

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import type { StripeCardElementChangeEvent } from '@stripe/stripe-js';
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
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // CardElement styling options
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: 'hsl(var(--foreground))',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: 'transparent',
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
    hidePostalCode: !showPostalCode,
    disableLink: true,
  };

  // Handle card element changes
  const handleCardChange = (event: StripeCardElementChangeEvent) => {
    // Update error state
    if (event.error) {
      const errorMessage = event.error.message || 'Invalid card details';
      setCardError(errorMessage);
      onError?.(errorMessage);
    } else {
      setCardError('');
      onError?.('');
    }

    // Update completion state
    setIsCardComplete(event.complete);
    onCardComplete?.(event.complete);
  };

  // Handle card element ready event
  const handleCardReady = () => {
    // Add a small delay to ensure the element is truly ready for data extraction
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
          <div className="pl-3 pr-2 py-3 bg-zinc-50 dark:bg-zinc-900/50 border-r border-zinc-200 dark:border-zinc-800 text-sm font-bold text-zinc-900 dark:text-zinc-50 shrink-0">
            Card Number
          </div>
          <div className="flex-1 px-3 py-3 relative">
            <CardElement
              id="card-element"
              options={cardElementOptions}
              onChange={handleCardChange}
              onReady={handleCardReady}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
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

    const cardElement = elements.getElement(CardElement);
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
