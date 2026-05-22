'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PaymentMethodList } from './PaymentMethodList';
import { StripeCardForm } from './StripeCardForm';
import {
  getMyPaymentMethods,
  createTenantPaymentIntent,
  addPaymentMethodToTenant,
  createTenantSubscription,
  type StripePaymentMethod,
} from '@/actions/stripeActions';
import type { PaymentMethod } from '@/types/stripe';
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

/**
 * Payment Confirmation Modal Component
 * Handles the complete payment flow for organization plan upgrades
 */

interface Plan {
  id: string;
  name: string;
  price: number;
  priceId: string;
  interval?: 'month' | 'year';
}

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  plan: Plan;
}

type PaymentStep =
  | 'loading'
  | 'select_method'
  | 'add_card'
  | 'processing'
  | 'success'
  | 'error';

export function PaymentConfirmationModal({
  isOpen,
  onClose,
  onSuccess,
  plan,
}: PaymentConfirmationModalProps) {
  const { data: session } = useSession();
  const stripe = useStripe();
  const elements = useElements();

  // State management
  const [step, setStep] = useState<PaymentStep>('loading');
  const [paymentMethods, setPaymentMethods] = useState<StripePaymentMethod[]>(
    [],
  );
  const [selectedMethodId, setSelectedMethodId] = useState<string>('');
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [isCardReady, setIsCardReady] = useState(false);
  const [cardError, setCardError] = useState('');
  const [error, setError] = useState('');
  const [processingMessage, setProcessingMessage] = useState('');

  // Fetch payment methods on mount
  const fetchPaymentMethods = useCallback(async () => {
    const accessToken = session?.accessToken;
    if (!accessToken) {
      setError('Not authenticated');
      setStep('error');
      return;
    }

    setStep('loading');
    setError('');

    try {
      const response = await getMyPaymentMethods(accessToken);

      if (response.success && response.data) {
        setPaymentMethods(response.data);

        // If we have payment methods, go to selection
        if (response.data.length > 0) {
          setStep('select_method');
          // Auto-select first method
          setSelectedMethodId(response.data[0].id);
        } else {
          // No payment methods, go directly to add card
          setStep('add_card');
          setIsCardReady(false);
        }
      } else {
        console.warn('Stripe payment methods fetch returned unsuccessful response, falling back to add card form:', response.message);
        setPaymentMethods([]);
        setStep('add_card');
        setIsCardReady(false);
      }
    } catch (err) {
      console.warn('Error fetching payment methods, falling back to add card form:', err);
      setPaymentMethods([]);
      setStep('add_card');
      setIsCardReady(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    if (isOpen) {
      fetchPaymentMethods();
    }
  }, [isOpen, fetchPaymentMethods]);

  const handleAddNewCard = () => {
    setStep('add_card');
    setIsCardReady(false);
    setCardError('');
  };

  const handleBackToSelection = () => {
    setStep('select_method');
    setCardError('');
  };

  const handleConfirmWithExistingCard = async () => {
    if (!selectedMethodId) {
      setError('Please select a payment method');
      return;
    }

    const accessToken = session?.accessToken;
    if (!accessToken) {
      setError('Not authenticated');
      return;
    }

    setStep('processing');
    setProcessingMessage('Creating subscription...');
    setError('');

    try {
      // Scenario A: Use existing payment method
      const response = await createTenantSubscription(
        plan.priceId,
        accessToken,
      );

      if (response.success) {
        setStep('success');
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to create subscription');
      }
    } catch (err) {
      console.error('Error creating subscription:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Payment failed. Please try again.',
      );
      setStep('select_method');
    }
  };

  const handleConfirmWithNewCard = async () => {
    if (!stripe || !elements) {
      setError('Payment system not ready. Please try again.');
      return;
    }

    if (!isCardReady) {
      setError('Card input is still loading. Please wait a moment.');
      return;
    }

    if (!isCardComplete) {
      setError('Please complete your card details');
      return;
    }

    const accessToken = session?.accessToken;
    if (!accessToken) {
      setError('Not authenticated');
      return;
    }

    // Get CardElement reference - it will stay mounted during processing
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card input not found. Please refresh and try again.');
      return;
    }

    console.log('CardElement reference obtained, starting payment...');

    setStep('processing');
    setError('');

    try {
      // Step 1: Create payment method from card element
      setProcessingMessage('Validating card...');
      console.log('Creating payment method from CardElement...');
      const { error: pmError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

      if (pmError) {
        console.error('Payment method creation error:', pmError);
        throw new Error(pmError.message || 'Failed to validate card');
      }

      if (!paymentMethod) {
        throw new Error('Failed to create payment method');
      }

      console.log('Payment method created:', paymentMethod.id);

      // Step 2: Attach payment method to customer (save it)
      setProcessingMessage('Saving payment method...');
      console.log('Adding payment method to tenant with ID:', paymentMethod.id);
      const addMethodResponse = await addPaymentMethodToTenant(
        paymentMethod.id,
        accessToken,
      );

      console.log('Add payment method response:', addMethodResponse);

      if (!addMethodResponse.success) {
        throw new Error(
          addMethodResponse.message || 'Failed to save payment method',
        );
      }

      // Step 3: Create payment intent for verification
      setProcessingMessage('Verifying card...');
      const paymentIntentResponse = await createTenantPaymentIntent(
        100, // $1.00 verification amount (will not be charged)
        'usd',
        accessToken,
      );

      if (!paymentIntentResponse.success || !paymentIntentResponse.data) {
        throw new Error(
          paymentIntentResponse.message || 'Failed to create payment intent',
        );
      }

      // Handle both client_secret (Stripe standard) and clientSecret (camelCase)
      const clientSecret =
        paymentIntentResponse.data.client_secret ||
        paymentIntentResponse.data.clientSecret;

      if (!clientSecret) {
        console.error('Payment intent response:', paymentIntentResponse);
        throw new Error('No client secret received from payment intent');
      }

      console.log('Payment Intent created with client secret');

      // Step 4: Confirm payment with the saved payment method
      setProcessingMessage('Confirming card...');
      console.log('Confirming payment with saved payment method...');
      const confirmResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      console.log('Confirm result:', confirmResult);

      if (confirmResult.error) {
        console.error('Payment confirmation error:', confirmResult.error);
        throw new Error(
          confirmResult.error.message || 'Card verification failed',
        );
      }

      console.log('Payment confirmed successfully');

      // Step 5: Create subscription
      setProcessingMessage('Creating subscription...');
      console.log('Creating subscription with plan price ID:', plan.priceId);
      const subscriptionResponse = await createTenantSubscription(
        plan.priceId,
        accessToken,
      );

      console.log('Create subscription response:', subscriptionResponse);

      if (!subscriptionResponse.success) {
        throw new Error(
          subscriptionResponse.message || 'Failed to create subscription',
        );
      }

      // Success!
      setStep('success');
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);
    } catch (err) {
      console.error('Error processing payment:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Payment failed. Please try again.',
      );
      setStep('add_card');
    }
  };

  const handleConfirm = () => {
    if (step === 'select_method') {
      handleConfirmWithExistingCard();
    } else if (step === 'add_card') {
      handleConfirmWithNewCard();
    }
  };

  const handleClose = () => {
    // Reset state
    setStep('loading');
    setPaymentMethods([]);
    setSelectedMethodId('');
    setIsCardComplete(false);
    setIsCardReady(false);
    setCardError('');
    setError('');
    setProcessingMessage('');
    onClose();
  };

  const canConfirm =
    (step === 'select_method' && selectedMethodId) ||
    (step === 'add_card' && isCardComplete && isCardReady && !cardError);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto backdrop-blur-2xl bg-white/70 dark:bg-zinc-950/80 border border-white/30 dark:border-zinc-800/80 shadow-2xl rounded-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-2xl font-extrabold bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            Confirm Payment
          </DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-sm">
            Complete your subscription to {plan.name}
          </DialogDescription>
        </DialogHeader>

        {/* Plan Summary */}
        <div className="backdrop-blur-md bg-white/40 dark:bg-zinc-900/30 border border-white/50 dark:border-zinc-800/50 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-500/5 rounded-full blur-2xl -z-10" />
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{plan.name} Plan</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
                Billed {plan.interval || 'monthly'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                ${plan.price}
              </div>
              <div className="text-zinc-400 dark:text-zinc-500 text-xs font-semibold">
                /{plan.interval || 'month'}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Wrapper - relative positioning for overlay */}
        <div className="relative mt-2">
          {/* Loading State */}
          {step === 'loading' && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative flex items-center justify-center">
                <div className="h-12 w-12 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin" />
                <div className="absolute h-6 w-6 rounded-full bg-indigo-500/5 blur-xs" />
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-4 font-medium">
                Loading payment methods...
              </p>
            </div>
          )}

          {/* Payment Method Selection */}
          {step === 'select_method' && (
            <div className="space-y-4">
              <PaymentMethodList
                paymentMethods={paymentMethods as unknown as PaymentMethod[]}
                selectedMethodId={selectedMethodId}
                onSelectMethod={setSelectedMethodId}
                onAddNew={handleAddNewCard}
              />
            </div>
          )}

          {/* Add New Card */}
          {(step === 'add_card' || step === 'processing') && (
            <div className="relative space-y-4">
              {paymentMethods.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={handleBackToSelection}
                  className="gap-2 text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-semibold"
                  disabled={step === 'processing'}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to saved cards
                </Button>
              )}

              <StripeCardForm
                onCardComplete={setIsCardComplete}
                onError={setCardError}
                onReady={() => setIsCardReady(true)}
              />
            </div>
          )}

          {/* Processing Overlay - shown on top of add_card step */}
          {step === 'processing' && (
            <div className="bg-white/80 dark:bg-zinc-950/80 absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl backdrop-blur-md">
              <div className="relative flex items-center justify-center">
                <div className="h-12 w-12 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin" />
                <div className="absolute h-8 w-8 rounded-full bg-indigo-500/10 animate-ping" />
              </div>
              <p className="text-zinc-800 dark:text-zinc-200 font-semibold text-sm mt-5">
                {processingMessage}
              </p>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1.5 text-xs">
                Please wait, do not close or refresh this page...
              </p>
            </div>
          )}

          {/* Success State */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20 animate-bounce">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h3 className="mb-1 text-xl font-bold text-zinc-900 dark:text-white">
                Payment Successful!
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-center text-sm">
                Your subscription has been activated. Redirecting...
              </p>
            </div>
          )}
        </div>
        {/* End of Main Content Wrapper */}

        {/* Error State */}
        {step === 'error' && (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {/* Error Message (inline) */}
        {error && step !== 'error' && (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400 mt-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        {step !== 'loading' && step !== 'processing' && step !== 'success' && (
          <div className="flex gap-3 pt-4 border-t border-black/5 dark:border-white/5 mt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 py-6 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5 font-semibold text-sm transition-all"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 py-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg hover:shadow-indigo-500/25 transition-all border-none disabled:bg-zinc-100 disabled:text-zinc-400 dark:disabled:bg-zinc-800/50 dark:disabled:text-zinc-600"
              disabled={!canConfirm}
            >
              Confirm & Pay ${plan.price}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PaymentConfirmationModal;
