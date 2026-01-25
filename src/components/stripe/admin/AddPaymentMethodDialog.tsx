'use client';

import { useState, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe, type Appearance } from '@stripe/stripe-js';
import { Loader2, CreditCard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { addPaymentMethod } from '@/actions/stripeActions';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  console.warn('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
}

const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

interface PaymentMethodFormProps {
  customerId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

function PaymentMethodForm({
  customerId,
  onSuccess,
  onCancel,
}: PaymentMethodFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements || !accessToken) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setIsLoading(true);
    setError(null);

    try {
      // Create payment method from the card element directly
      // This matches "To get this Payment Method ID, you use the Stripe Element on the frontend"
      const { error: pmError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

      if (pmError) {
        setError(pmError.message || 'Failed to create payment method');
        setIsLoading(false);
        return;
      }

      // "You then use this ID when calling your backend API to attach or add the payment method"
      console.log('paymentMethod payload', {
        customerId,
        paymentMethodId: paymentMethod.id,
        accessToken,
      });
      const result = await addPaymentMethod(
        customerId,
        paymentMethod.id,
        accessToken,
      );

      console.log('addPaymentMethod result', result);

      if (result.success) {
        onSuccess();
      } else {
        setError(result.message || 'Failed to attach payment method');
      }
    } catch (err) {
      console.error('Payment method error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-muted/30 rounded-lg border p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-md border p-3 text-sm">
          {error}
        </div>
      )}

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !stripe || !elements}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Add Payment Method
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

interface AddPaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  customerName?: string;
  onSuccess: () => void;
}

export function AddPaymentMethodDialog({
  open,
  onOpenChange,
  customerId,
  customerName,
  onSuccess,
}: AddPaymentMethodDialogProps) {
  const handleSuccess = () => {
    onSuccess();
    onOpenChange(false);
  };

  const appearance: Appearance = {
    theme: 'flat',
    variables: {
      colorPrimary: 'hsl(0 0% 9%)',
      colorBackground: 'hsl(0 0% 100%)',
    },
  };

  if (!stripePromise) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configuration Error</DialogTitle>
            <DialogDescription>
              Stripe is not configured. Please add
              NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            Add a new card for {customerName || 'this customer'}
          </DialogDescription>
        </DialogHeader>

        <Elements stripe={stripePromise} options={{ appearance }}>
          <PaymentMethodForm
            customerId={customerId}
            onSuccess={handleSuccess}
            onCancel={() => onOpenChange(false)}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
}
