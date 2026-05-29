'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
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
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl shadow-2xl">
        <DialogHeader className="text-center sm:text-left">
          <DialogTitle className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center justify-center sm:justify-start">
            Secure Checkout
          </DialogTitle>
        </DialogHeader>

        {/* Plan Summary Card */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{plan.name} Plan</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-450 mt-1 leading-snug">
                Billed {plan.interval === 'month' ? 'Monthly' : plan.interval === 'year' ? 'Yearly' : plan.interval || 'Monthly'}
              </p>
            </div>
            <div className="text-right flex items-center">
              <div className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">${plan.price}</div>
            </div>
          </div>
        </div>

        {/* Main Content Wrapper - relative positioning for overlay */}
        <div className="relative flex flex-col justify-center mt-1">
          <AnimatePresence mode="wait">
            {/* Loading State */}
            {step === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center py-4 space-y-3"
              >
                <Loader2 className="text-indigo-500 h-8 w-8 animate-spin" />
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium animate-pulse">
                  Querying vault credentials...
                </p>
              </motion.div>
            )}

            {/* Payment Method Selection */}
            {step === 'select_method' && (
              <motion.div
                key="select_method"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <PaymentMethodList
                  paymentMethods={paymentMethods as unknown as PaymentMethod[]}
                  selectedMethodId={selectedMethodId}
                  onSelectMethod={setSelectedMethodId}
                  onAddNew={handleAddNewCard}
                />
              </motion.div>
            )}

            {/* Add New Card */}
            {(step === 'add_card' || step === 'processing') && (
              <motion.div
                key="add_card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="relative space-y-1"
              >
                {paymentMethods.length > 0 && (
                  <Button
                    variant="ghost"
                    onClick={handleBackToSelection}
                    className="gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                    disabled={step === 'processing'}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to saved cards
                  </Button>
                )}

                <StripeCardForm
                  onCardComplete={setIsCardComplete}
                  onError={setCardError}
                  onReady={() => setIsCardReady(true)}
                />
              </motion.div>
            )}

            {/* Success State */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', damping: 15 }}
                className="flex flex-col items-center justify-center py-10 text-center space-y-5"
              >
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 size-16 rounded-full bg-emerald-500/20 dark:bg-emerald-500/10 blur-xl animate-pulse" />
                  <motion.div
                    initial={{ scale: 0.7, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
                  </motion.div>
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                    Upgrade Successful!
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                    Your {plan.name} subscription is active. Preparing your intelligence sandbox...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Processing Overlay */}
          {step === 'processing' && (
            <div className="bg-white/95 dark:bg-zinc-950/95 absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl backdrop-blur-md space-y-4">
              <Loader2 className="text-indigo-500 h-10 w-10 animate-spin" />
              <div className="text-center space-y-1">
                <p className="text-zinc-950 dark:text-zinc-50 text-sm font-bold animate-pulse">
                  {processingMessage}
                </p>
                <p className="text-zinc-400 dark:text-zinc-500 text-xs">
                  Securing transaction block, please do not close...
                </p>
              </div>
            </div>
          )}
        </div>
        {/* End of Main Content Wrapper */}

        {/* Error State */}
        {step === 'error' && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/50 p-4 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <p className="leading-snug">{error}</p>
          </div>
        )}

        {/* Error Message (inline) */}
        {error && step !== 'error' && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/50 p-4 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <p className="leading-snug">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        {step !== 'loading' && step !== 'processing' && step !== 'success' && (
          <div className="flex gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-900/40 mt-1">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 py-3 rounded-xl border-zinc-250 dark:border-zinc-800 font-bold text-zinc-500 dark:text-zinc-400"
            >
              Cancel
            </Button>
              <Button
                onClick={handleConfirm}
                className={cn(
                  "flex-1 py-3 rounded-xl font-bold transition-all duration-300 text-white dark:text-zinc-900 border-none shadow-md",
                  canConfirm
                    ? "bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 shadow-sm hover:scale-[1.01]"
                    : "bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-900 dark:text-zinc-600 shadow-none"
                )}
              disabled={!canConfirm}
            >
              Confirm Checkout - ${plan.price}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PaymentConfirmationModal;
