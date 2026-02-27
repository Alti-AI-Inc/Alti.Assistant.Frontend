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
  CreditCard,
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

type PaymentStep = 'loading' | 'select_method' | 'add_card' | 'processing' | 'success' | 'error';

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
  const [paymentMethods, setPaymentMethods] = useState<StripePaymentMethod[]>([]);
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
        throw new Error(response.message || 'Failed to fetch payment methods');
      }
    } catch (err) {
      console.error('Error fetching payment methods:', err);
      setError(err instanceof Error ? err.message : 'Failed to load payment methods');
      setStep('error');
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
        accessToken
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
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
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
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
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
        accessToken
      );

      console.log('Add payment method response:', addMethodResponse);

      if (!addMethodResponse.success) {
        throw new Error(addMethodResponse.message || 'Failed to save payment method');
      }

      // Step 3: Create payment intent for verification
      setProcessingMessage('Verifying card...');
      const paymentIntentResponse = await createTenantPaymentIntent(
        100, // $1.00 verification amount (will not be charged)
        'usd',
        accessToken
      );

      if (!paymentIntentResponse.success || !paymentIntentResponse.data) {
        throw new Error(paymentIntentResponse.message || 'Failed to create payment intent');
      }

      // Handle both client_secret (Stripe standard) and clientSecret (camelCase)
      const clientSecret = paymentIntentResponse.data.client_secret || paymentIntentResponse.data.clientSecret;
      
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
        throw new Error(confirmResult.error.message || 'Card verification failed');
      }

      console.log('Payment confirmed successfully');

      // Step 5: Create subscription
      setProcessingMessage('Creating subscription...');
      console.log('Creating subscription with plan price ID:', plan.priceId);
      const subscriptionResponse = await createTenantSubscription(
        plan.priceId,
        accessToken
      );

      console.log('Create subscription response:', subscriptionResponse);

      if (!subscriptionResponse.success) {
        throw new Error(subscriptionResponse.message || 'Failed to create subscription');
      }

      // Success!
      setStep('success');
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);
    } catch (err) {
      console.error('Error processing payment:', err);
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Confirm Payment</DialogTitle>
          <DialogDescription>
            Complete your subscription to {plan.name}
          </DialogDescription>
        </DialogHeader>

        {/* Plan Summary */}
        <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">{plan.name}</h3>
              <p className="text-sm text-muted-foreground">
                Billed {plan.interval || 'monthly'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">${plan.price}</div>
              <div className="text-xs text-muted-foreground">/{plan.interval || 'month'}</div>
            </div>
          </div>
        </div>

        {/* Main Content Wrapper - relative positioning for overlay */}
        <div className="relative min-h-[200px]">
        {/* Loading State */}
        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Loading payment methods...</p>
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
          <div className="space-y-4 relative">
            {paymentMethods.length > 0 && (
              <Button
                variant="ghost"
                onClick={handleBackToSelection}
                className="gap-2"
                disabled={step === 'processing'}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to saved cards
              </Button>
            )}

            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5" />
              <h3 className="font-semibold">Add Payment Method</h3>
            </div>

            <StripeCardForm
              onCardComplete={setIsCardComplete}
              onError={setCardError}
              onReady={() => setIsCardReady(true)}
            />
          </div>
        )}

        {/* Processing Overlay - shown on top of add_card step */}
        {step === 'processing' && (
          <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">{processingMessage}</p>
            <p className="text-xs text-muted-foreground mt-2">Please wait...</p>
          </div>
        )}

        {/* Success State */}
        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
            <p className="text-sm text-muted-foreground text-center">
              Your subscription has been activated. Redirecting...
            </p>
          </div>
        )}
        </div>
        {/* End of Main Content Wrapper */}

        {/* Error State */}
        {step === 'error' && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-200">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Error Message (inline) */}
        {error && step !== 'error' && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-200">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        {step !== 'loading' && step !== 'processing' && step !== 'success' && (
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1"
              disabled={!canConfirm}
            >
              Confirm Payment - ${plan.price}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PaymentConfirmationModal;
