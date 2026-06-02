'use client';

import { StripeProviderWithErrorBoundary } from '@/components/stripe/StripeProvider';
import { StripeCardForm } from '@/components/stripe/StripeCardForm';
import { addPaymentMethodToTenant } from '@/actions/stripeActions';
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useTenant } from '@/contexts/TenantContext';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

function BillingFormContent() {
  const stripe = useStripe();
  const elements = useElements();
  const { data: session } = useSession();
  
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [isCardReady, setIsCardReady] = useState(false);
  const [cardError, setCardError] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveCard = async () => {
    if (!stripe || !elements) return;
    if (!isCardComplete) return;

    setIsSaving(true);
    try {
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) {
        throw new Error('Card input element not found.');
      }

      // Step 1: Create Stripe Payment Method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: cardholderName.trim() || session?.user?.name || undefined,
        },
      });

      if (pmError) {
        throw new Error(pmError.message || 'Failed to create payment method');
      }

      if (!paymentMethod) {
        throw new Error('Payment method creation failed.');
      }

      // Step 2: Attach to Tenant
      const accessToken = session?.accessToken;
      if (!accessToken) {
        throw new Error('User session not authenticated.');
      }

      const response = await addPaymentMethodToTenant(paymentMethod.id, accessToken);
      if (response.success) {
        toast.success('Payment card saved successfully.');
        // Clear card details or reload
        window.location.reload();
      } else {
        throw new Error(response.message || 'Failed to add card to organization.');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Failed to save card. Please check details and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <StripeCardForm
        onCardComplete={setIsCardComplete}
        onError={setCardError}
        onReady={() => setIsCardReady(true)}
        onCardholderNameChange={setCardholderName}
        disabled={isSaving}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div className="text-[10px] text-gray-500 max-w-none">
          <span className="font-semibold text-black dark:text-gray-300">Stripe Security Notice:</span> Your card information is encrypted and securely saved via Stripe Vault.
        </div>
        <Button
          onClick={handleSaveCard}
          disabled={isSaving || !isCardComplete || !isCardReady}
          className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 text-xs h-10 px-6 rounded-lg shadow-md hover:shadow-lg transition-all shrink-0"
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />}
          {isSaving ? 'Saving Card...' : 'Save Card'}
        </Button>
      </div>
    </div>
  );
}

export default function AdminBillingPage() {
  const { currentTenant } = useTenant();

  if (!currentTenant) {
    return (
      <div className="h-full flex flex-col bg-[#F5F5F7] dark:bg-gray-950 overflow-hidden items-center justify-center p-8">
        <p className="text-gray-500 text-sm">
          Please select an organization to manage billing.
        </p>
      </div>
    );
  }

  return (
    <StripeProviderWithErrorBoundary>
      <div className="h-full flex flex-col bg-[#F5F5F7] dark:bg-gray-950 overflow-hidden">
        {/* Dynamic Header */}
        <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-[#F5F5F7] dark:bg-gray-950">
          <h1 className="text-base font-semibold text-gray-900 dark:text-white">
            Billing Management
          </h1>
        </div>

        {/* Main Workspace Body */}
        <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6">
          <div className="max-w-5xl mx-auto mt-4">
            <BillingFormContent />
          </div>
        </div>
      </div>
    </StripeProviderWithErrorBoundary>
  );
}
