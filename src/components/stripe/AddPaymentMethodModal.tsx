'use client';

import { useState } from 'react';
import { useStripe, useElements, CardNumberElement } from '@stripe/react-stripe-js';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StripeCardForm } from './StripeCardForm';
import { addPaymentMethodToTenant } from '@/actions/stripeActions';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddPaymentMethodModal({
  isOpen,
  onClose,
  onSuccess,
}: AddPaymentMethodModalProps) {
  const { data: session } = useSession();
  const stripe = useStripe();
  const elements = useElements();

  const [isCardComplete, setIsCardComplete] = useState(false);
  const [isCardReady, setIsCardReady] = useState(false);
  const [cardError, setCardError] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error('Payment system not ready. Please try again.');
      return;
    }

    if (!isCardComplete) {
      toast.error('Please complete your card details');
      return;
    }

    const accessToken = session?.accessToken;
    if (!accessToken) {
      toast.error('Not authenticated');
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      toast.error('Card input element not found.');
      return;
    }

    setIsSubmitting(true);
    setCardError('');

    try {
      // 1. Create payment method on Stripe
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: cardholderName.trim() || session?.user?.name || undefined,
        },
      });

      if (pmError) {
        throw new Error(pmError.message || 'Failed to validate card');
      }

      if (!paymentMethod) {
        throw new Error('Failed to create payment method');
      }

      // 2. Attach payment method to current tenant
      const addMethodResponse = await addPaymentMethodToTenant(
        paymentMethod.id,
        accessToken,
      );

      if (!addMethodResponse.success) {
        throw new Error(addMethodResponse.message || 'Failed to save payment method');
      }

      toast.success('Payment method added successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('[AddPaymentMethodModal] Error adding card:', err);
      const msg = err instanceof Error ? err.message : 'Failed to save payment method';
      setCardError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-950/95 border-zinc-800 text-zinc-100 backdrop-blur-md shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <CreditCard className="size-5 text-zinc-400" />
            Add Payment Method
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Save a credit or debit card for organization subscription and usage charges.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <StripeCardForm
            onCardComplete={setIsCardComplete}
            onReady={() => setIsCardReady(true)}
            onError={setCardError}
            onCardholderNameChange={setCardholderName}
            disabled={isSubmitting}
          />

          {cardError && (
            <div className="text-red-500 text-sm bg-red-950/20 border border-red-900/30 rounded-lg p-3">
              {cardError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={onClose}
              className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-100 text-zinc-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isCardComplete || !isCardReady}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving Card...
                </>
              ) : (
                'Save Payment Method'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
