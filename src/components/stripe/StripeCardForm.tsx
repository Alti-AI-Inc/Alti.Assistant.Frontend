'use client';

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import type { StripeCardElementChangeEvent } from '@stripe/stripe-js';
import { Label } from '@/components/ui/label';
import { AlertCircle, CreditCard, Lock } from 'lucide-react';
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
          color: 'hsl(var(--muted-foreground))',
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
    <div className={cn('space-y-4', className)}>
      {/* Card Input Section */}
      <div>
        <Label htmlFor="card-element" className="flex items-center gap-2 mb-2">
          <CreditCard className="w-4 h-4" />
          Card Details
        </Label>
        
        <div
          className={cn(
            'relative rounded-md border-2 transition-colors',
            isFocused
              ? 'border-primary ring-2 ring-primary/20'
              : cardError
              ? 'border-destructive'
              : isCardComplete
              ? 'border-green-500'
              : 'border-input',
            'bg-background px-3 py-3'
          )}
        >
          <CardElement
            id="card-element"
            options={cardElementOptions}
            onChange={handleCardChange}
            onReady={handleCardReady}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>

        {/* Error Message */}
        {cardError && (
          <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{cardError}</span>
          </div>
        )}

        {/* Helper Text */}
        {!cardError && (
          <p className="text-xs text-muted-foreground mt-2">
            Enter your card number, expiration date, and security code
          </p>
        )}
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50 border border-border">
        <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Secure Payment</p>
          <p>
            Your card information is encrypted and securely processed by Stripe.
            We never store your card details.
          </p>
        </div>
      </div>

      {/* Accepted Cards */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <span className="text-xs text-muted-foreground">We accept:</span>
        <div className="flex items-center gap-2">
          {['Visa', 'Mastercard', 'Amex', 'Discover'].map((brand) => (
            <div
              key={brand}
              className="px-2 py-1 rounded border border-border bg-card text-xs font-medium text-muted-foreground"
            >
              {brand}
            </div>
          ))}
        </div>
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
