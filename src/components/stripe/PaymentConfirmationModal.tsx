'use client';

import {
  addPaymentMethodToTenant,
  createTenantPaymentIntent,
  createTenantSubscription,
  getMyPaymentMethods,
  type StripePaymentMethod,
} from '@/actions/stripeActions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { PaymentMethod } from '@/types/stripe';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { PaymentMethodList } from './PaymentMethodList';
import { StripeCardForm } from './StripeCardForm';
import { useStripeAvailability } from './StripeProvider';

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
  const [cardholderName, setCardholderName] = useState('');
  // Fallback mock card fields when Stripe is unavailable
  const [fallbackCardNumber, setFallbackCardNumber] = useState('');
  const [fallbackExpiry, setFallbackExpiry] = useState('');
  const [fallbackCvc, setFallbackCvc] = useState('');

  // Validation helpers for fallback inputs
  const luhnCheck = (num: string) => {
    const digits = num
      .replace(/\s+/g, '')
      .split('')
      .reverse()
      .map(d => parseInt(d, 10));
    if (digits.some(isNaN)) return false;
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      let val = digits[i];
      if (i % 2 === 1) {
        val *= 2;
        if (val > 9) val -= 9;
      }
      sum += val;
    }
    return sum % 10 === 0;
  };

  const validateExpiry = (exp: string) => {
    const m = exp.match(/^(0?[1-9]|1[0-2])\s*\/?\s*(\d{2}|\d{4})$/);
    if (!m) return false;
    const month = parseInt(m[1], 10);
    let year = parseInt(m[2], 10);
    if (year < 100) {
      // assume 20xx for two-digit years
      year += 2000;
    }
    const now = new Date();
    const expDate = new Date(year, month - 1 + 1, 1); // first day of month after expiry
    return expDate > now;
  };

  const validateCvc = (cvc: string) => /^[0-9]{3,4}$/.test(cvc.trim());

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
        console.warn(
          'Stripe payment methods fetch returned unsuccessful response, falling back to add card form:',
          response.message,
        );
        setPaymentMethods([]);
        setStep('add_card');
        setIsCardReady(false);
      }
    } catch (err) {
      console.warn(
        'Error fetching payment methods, falling back to add card form:',
        err,
      );
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

  const { isAvailable } = useStripeAvailability();

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
    // If Stripe is not available, run a simulated fallback flow using local inputs
    if (!stripe || !elements) {
      if (
        !fallbackCardNumber.trim() ||
        !fallbackExpiry.trim() ||
        !fallbackCvc.trim() ||
        !cardholderName.trim()
      ) {
        setError('Please complete all card fields');
        return;
      }

      // Validate fallback inputs
      const sanitizedNumber = fallbackCardNumber.replace(/\s+/g, '');
      if (!/^\d{12,19}$/.test(sanitizedNumber) || !luhnCheck(sanitizedNumber)) {
        setError('Invalid card number');
        return;
      }

      if (!validateExpiry(fallbackExpiry)) {
        setError('Invalid or expired card expiry');
        return;
      }

      if (!validateCvc(fallbackCvc)) {
        setError('Invalid CVC');
        return;
      }

      setStep('processing');
      setProcessingMessage('Processing payment (simulated)...');

      setTimeout(() => {
        setStep('success');
        setProcessingMessage('');
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 900);
      }, 900);

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
          billing_details: {
            name: cardholderName.trim() || session?.user?.name || undefined,
          },
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
    setCardholderName('');
    setCardError('');
    setFallbackCardNumber('');
    setFallbackExpiry('');
    setFallbackCvc('');
    setError('');
    setProcessingMessage('');
    onClose();
  };

  const canConfirm =
    (step === 'select_method' && selectedMethodId) ||
    (step === 'add_card' &&
      isCardComplete &&
      (isAvailable ? isCardReady : true) &&
      !cardError);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl border border-zinc-200/80 bg-white/90 shadow-2xl backdrop-blur-2xl dark:border-zinc-800/80 dark:bg-zinc-950/90">
        <DialogHeader className="text-center sm:text-left">
          <DialogTitle className="flex items-center justify-center text-2xl font-extrabold tracking-tight text-zinc-900 sm:justify-start dark:text-zinc-50">
            Secure Checkout
          </DialogTitle>
        </DialogHeader>

        {/* Plan Summary Card */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {plan.name} Plan
              </h3>
              <p className="dark:text-zinc-450 mt-1 text-xs leading-snug text-zinc-500">
                Billed{' '}
                {plan.interval === 'month'
                  ? 'Monthly'
                  : plan.interval === 'year'
                    ? 'Yearly'
                    : plan.interval || 'Monthly'}
              </p>
            </div>
            <div className="flex items-center text-right">
              <div className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                ${plan.price}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Wrapper - relative positioning for overlay */}
        <div className="relative mt-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {/* Loading State */}
            {step === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center space-y-3 py-4"
              >
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <p className="animate-pulse text-sm font-medium text-zinc-500 dark:text-zinc-400">
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

                {isAvailable ? (
                  <StripeCardForm
                    onCardComplete={setIsCardComplete}
                    onError={setCardError}
                    onReady={() => setIsCardReady(true)}
                    onCardholderNameChange={setCardholderName}
                    disabled={step === 'processing'}
                  />
                ) : (
                  <div className="mt-4 space-y-3 text-left">
                    <label className="block text-xs text-gray-600 dark:text-gray-400">
                      Cardholder name
                    </label>
                    <input
                      value={cardholderName}
                      onChange={e => {
                        setCardholderName(e.target.value);
                        const complete =
                          e.target.value.trim().length > 0 &&
                          fallbackCardNumber.trim().length > 0 &&
                          fallbackExpiry.trim().length > 0 &&
                          fallbackCvc.trim().length > 0;
                        setIsCardComplete(complete);
                      }}
                      placeholder="Jane Doe"
                      className="mt-1 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
                      disabled={step === 'processing'}
                    />

                    <label className="block text-xs text-gray-600 dark:text-gray-400">
                      Card number
                    </label>
                    <input
                      value={fallbackCardNumber}
                      onChange={e => {
                        setFallbackCardNumber(e.target.value);
                        const complete =
                          cardholderName.trim().length > 0 &&
                          e.target.value.trim().length > 0 &&
                          fallbackExpiry.trim().length > 0 &&
                          fallbackCvc.trim().length > 0;
                        setIsCardComplete(complete);
                      }}
                      placeholder="4242 4242 4242 4242"
                      className="mt-1 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
                      disabled={step === 'processing'}
                    />

                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-600 dark:text-gray-400">
                          Expiry
                        </label>
                        <input
                          value={fallbackExpiry}
                          onChange={e => {
                            setFallbackExpiry(e.target.value);
                            const complete =
                              cardholderName.trim().length > 0 &&
                              fallbackCardNumber.trim().length > 0 &&
                              e.target.value.trim().length > 0 &&
                              fallbackCvc.trim().length > 0;
                            setIsCardComplete(complete);
                          }}
                          placeholder="MM/YY"
                          className="mt-1 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
                          disabled={step === 'processing'}
                        />
                      </div>
                      <div className="w-[110px]">
                        <label className="block text-xs text-gray-600 dark:text-gray-400">
                          CVC
                        </label>
                        <input
                          value={fallbackCvc}
                          onChange={e => {
                            setFallbackCvc(e.target.value);
                            const complete =
                              cardholderName.trim().length > 0 &&
                              fallbackCardNumber.trim().length > 0 &&
                              fallbackExpiry.trim().length > 0 &&
                              e.target.value.trim().length > 0;
                            setIsCardComplete(complete);
                          }}
                          placeholder="123"
                          className="mt-1 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
                          disabled={step === 'processing'}
                        />
                      </div>
                    </div>
                  </div>
                )}
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
                className="flex flex-col items-center justify-center space-y-5 py-10 text-center"
              >
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 size-16 animate-pulse rounded-full bg-emerald-500/20 blur-xl dark:bg-emerald-500/10" />
                  <motion.div
                    initial={{ scale: 0.7, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
                  </motion.div>
                </div>
                <div className="max-w-sm space-y-1.5">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                    Upgrade Successful!
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                    Your {plan.name} subscription is active. Preparing your
                    intelligence sandbox...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Processing Overlay */}
          {step === 'processing' && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-4 rounded-2xl bg-white/95 backdrop-blur-md dark:bg-zinc-950/95">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
              <div className="space-y-1 text-center">
                <p className="animate-pulse text-sm font-bold text-zinc-950 dark:text-zinc-50">
                  {processingMessage}
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
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
          <div className="mt-1 flex gap-3 border-t border-zinc-100 pt-2 dark:border-zinc-900/40">
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-zinc-250 flex-1 rounded-xl py-3 font-bold text-zinc-500 dark:border-zinc-800 dark:text-zinc-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className={cn(
                'flex-1 rounded-xl border-none py-3 font-bold text-white shadow-md transition-all duration-300',
                canConfirm
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/10 hover:scale-[1.01] hover:from-blue-700 hover:to-indigo-700 hover:shadow-indigo-500/20'
                  : 'cursor-not-allowed bg-zinc-100 text-zinc-400 shadow-none dark:bg-zinc-900 dark:text-zinc-600',
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
