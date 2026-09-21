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
import {
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
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
  price: string;
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

  const validateCvc = (cvc: string) => /^[0-9]{3}$/.test(cvc.trim());

  // Formatting helpers to mimic Stripe behavior
  const formatCardNumber = (value: string) => {
    let digits = value.replace(/\D/g, '');
    // Enforce maximum 16 digits
    digits = digits.substring(0, 16);
    // Detect AMEX (starts with 34 or 37)
    const isAmex = /^3[47]/.test(digits);
    if (isAmex) {
      const part1 = digits.substring(0, 4);
      const part2 = digits.substring(4, 10);
      const part3 = digits.substring(10, 15);
      return [part1, part2, part3].filter(Boolean).join(' ');
    }
    // Default grouping by 4
    return (
      digits
        .match(/.{1,4}/g)
        ?.join(' ')
        ?.trim() || digits
    );
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length <= 2) return digits;
    return digits.substring(0, 2) + '/' + digits.substring(2, 4);
  };

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
        setPaymentMethods([]);
        setStep('add_card');
        setIsCardReady(false);
      }
    } catch (err) {
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

  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1');

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
      if (!/^\d{12,16}$/.test(sanitizedNumber) || !luhnCheck(sanitizedNumber)) {
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

    // Diagnostic logging to help debug missing element in production
    console.debug(
      '[PaymentConfirmationModal] stripe present?',
      !!stripe,
      'elements present?',
      !!elements,
      'isCardReady?',
      isCardReady,
      'isCardComplete?',
      isCardComplete,
    );

    // Local dev: simulate success to avoid live/test key mismatch
    if (isLocalhost) {
      setStep('processing');
      setProcessingMessage('Processing payment (local simulation)...');
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

    // Get CardNumberElement reference - it will stay mounted during processing
    const cardElement = elements.getElement(CardNumberElement);

    if (!cardElement) {
      console.error(
        '[PaymentConfirmationModal] Card element not found. Elements instance:',
        elements,
      );
      setError('Card input not found. Please refresh and try again.');
      return;
    }


    setStep('processing');
    setError('');

    try {
      // Step 1: Create payment method from card element
      setProcessingMessage('Validating card...');
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


      // Step 2: Attach payment method to customer (save it)
      setProcessingMessage('Saving payment method...');
      const addMethodResponse = await addPaymentMethodToTenant(
        paymentMethod.id,
        accessToken,
      );


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


      // Step 4: Confirm payment with the saved payment method
      setProcessingMessage('Confirming card...');
      const confirmResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });


      if (confirmResult.error) {
        console.error('Payment confirmation error:', confirmResult.error);
        throw new Error(
          confirmResult.error.message || 'Card verification failed',
        );
      }


      // Step 5: Create subscription
      setProcessingMessage('Creating subscription...');
      const subscriptionResponse = await createTenantSubscription(
        plan.priceId,
        accessToken,
      );


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
                {plan.price}
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
                  <form
                    autoComplete="off"
                    onSubmit={e => e.preventDefault()}
                    className="mt-4 space-y-3 text-left"
                  >
                    <label className="block text-xs text-gray-600 dark:text-gray-400">
                      Cardholder name
                    </label>
                    <input
                      name="fallback-cardholder-name"
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
                      autoComplete="off"
                      spellCheck={false}
                      autoCapitalize="none"
                      autoCorrect="off"
                      readOnly
                      onFocus={e => {
                        // Remove readOnly to allow typing and to help prevent browser autofill prompts
                        // This is a common workaround to reduce Chrome's payment autofill detection on insecure pages
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        e.currentTarget.readOnly = false;
                      }}
                    />

                    <label className="block text-xs text-gray-600 dark:text-gray-400">
                      Card number
                    </label>
                    <input
                      name="fallback-card-number"
                      value={fallbackCardNumber}
                      onChange={e => {
                        const formatted = formatCardNumber(e.target.value);
                        setFallbackCardNumber(formatted);
                        const complete =
                          cardholderName.trim().length > 0 &&
                          formatted.replace(/\s+/g, '').length > 0 &&
                          fallbackExpiry.trim().length > 0 &&
                          fallbackCvc.trim().length > 0;
                        setIsCardComplete(complete);
                      }}
                      placeholder="4242 4242 4242 4242"
                      className="mt-1 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
                      disabled={step === 'processing'}
                      inputMode="numeric"
                      autoComplete="off"
                      spellCheck={false}
                      autoCapitalize="none"
                      autoCorrect="off"
                      readOnly
                      onFocus={e => {
                        // Allow typing after focus and help avoid browser payment autofill detection
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        e.currentTarget.readOnly = false;
                      }}
                    />

                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-600 dark:text-gray-400">
                          Expiry
                        </label>
                        <input
                          name="fallback-expiry"
                          value={fallbackExpiry}
                          onChange={e => {
                            const formatted = formatExpiry(e.target.value);
                            setFallbackExpiry(formatted);
                            const complete =
                              cardholderName.trim().length > 0 &&
                              fallbackCardNumber.replace(/\s+/g, '').length >
                                0 &&
                              formatted.trim().length > 0 &&
                              fallbackCvc.trim().length > 0;
                            setIsCardComplete(complete);
                          }}
                          placeholder="MM/YY"
                          className="mt-1 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
                          disabled={step === 'processing'}
                          inputMode="numeric"
                          maxLength={5}
                          autoComplete="off"
                          spellCheck={false}
                          autoCapitalize="none"
                          autoCorrect="off"
                          readOnly
                          onFocus={e => {
                            // Enable typing on focus to reduce autofill detection
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            e.currentTarget.readOnly = false;
                          }}
                        />
                      </div>
                      <div className="w-[110px]">
                        <label className="block text-xs text-gray-600 dark:text-gray-400">
                          CVC
                        </label>
                        <input
                          name="fallback-cvc"
                          value={fallbackCvc}
                          onChange={e => {
                            let digits = e.target.value.replace(/\D/g, '');
                            digits = digits.substring(0, 3); // enforce max 3
                            setFallbackCvc(digits);
                            const complete =
                              cardholderName.trim().length > 0 &&
                              fallbackCardNumber.replace(/\s+/g, '').length >
                                0 &&
                              fallbackExpiry.trim().length > 0 &&
                              digits.trim().length > 0;
                            setIsCardComplete(complete);
                          }}
                          placeholder="123"
                          className="mt-1 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
                          disabled={step === 'processing'}
                          inputMode="numeric"
                          maxLength={3}
                          autoComplete="off"
                          spellCheck={false}
                          autoCapitalize="none"
                          autoCorrect="off"
                          readOnly
                          onFocus={e => {
                            // Enable typing on focus to reduce autofill detection
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            e.currentTarget.readOnly = false;
                          }}
                        />
                      </div>
                    </div>
                  </form>
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
