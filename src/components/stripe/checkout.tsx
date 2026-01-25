'use client';

import { useState, FormEvent } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe, type Appearance } from '@stripe/stripe-js';
import { Loader2, CreditCard, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Validate publishable key at module load time
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable. Please add it to your .env.local file.',
  );
}

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(publishableKey);

interface PaymentFormProps {
  amount?: number;
  currency?: string;
}

function PaymentForm({ amount = 9900, currency = 'usd' }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setMessage(error.message ?? 'An error occurred with your card.');
        } else {
          setMessage('An unexpected error occurred.');
        }
      }
    } catch (err) {
      console.error('Payment confirmation error:', err);
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Format amount for display
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);

  return (
    <Card className="mx-auto w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="text-primary h-5 w-5" />
          <CardTitle className="text-xl">Payment Details</CardTitle>
        </div>
        <CardDescription>
          Complete your payment of{' '}
          <span className="text-foreground font-semibold">
            {formattedAmount}
          </span>
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="bg-muted/30 rounded-lg border p-4">
            <PaymentElement
              id="payment-element"
              options={{
                layout: 'tabs',
              }}
            />
          </div>

          {message && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-md border p-3 text-sm">
              {message}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-2">
          <Button
            type="submit"
            disabled={isLoading || !stripe || !elements}
            className="h-11 w-full text-base font-medium"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>Pay {formattedAmount}</>
            )}
          </Button>

          <div className="text-muted-foreground flex items-center justify-center gap-1.5 text-xs">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Secured by Stripe</span>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

interface CheckoutFormProps {
  clientSecret: string;
  amount?: number;
  currency?: string;
}

export default function CheckoutForm({
  clientSecret,
  amount,
  currency,
}: CheckoutFormProps) {
  // Stripe appearance matching shadcn theme
  const appearance: Appearance = {
    theme: 'flat',
    variables: {
      colorPrimary: 'hsl(0 0% 9%)', // matches --primary in light mode
      colorBackground: 'hsl(0 0% 100%)',
      colorText: 'hsl(0 0% 9%)',
      colorDanger: 'hsl(0 84% 60%)',
      fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
      borderRadius: '0.5rem',
      spacingUnit: '4px',
    },
    rules: {
      '.Input': {
        border: '1px solid hsl(0 0% 90%)',
        boxShadow: 'none',
        padding: '12px',
      },
      '.Input:focus': {
        border: '1px solid hsl(0 0% 56%)',
        boxShadow: '0 0 0 2px rgba(180, 180, 180, 0.2)',
      },
      '.Label': {
        fontWeight: '500',
        marginBottom: '6px',
      },
      '.Tab': {
        border: '1px solid hsl(0 0% 90%)',
        borderRadius: '0.375rem',
      },
      '.Tab--selected': {
        border: '1px solid hsl(0 0% 9%)',
        backgroundColor: 'hsl(0 0% 97%)',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={{ appearance, clientSecret }}>
      <PaymentForm amount={amount} currency={currency} />
    </Elements>
  );
}
