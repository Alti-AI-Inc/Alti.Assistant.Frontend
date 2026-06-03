'use client';

import { StripeProviderWithErrorBoundary } from '@/components/stripe/StripeProvider';
import { StripeCardForm } from '@/components/stripe/StripeCardForm';
import { addPaymentMethodToTenant } from '@/actions/stripeActions';
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useTenant } from '@/contexts/TenantContext';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Plus, ArrowRight, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/stores/useModalStore';
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
  const { currentTenant, tenants, switchToTenantMode, isLoading } = useTenant();
  const { onOpen } = useModalStore();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#F5F5F7] dark:bg-gray-950">
        <span className="text-gray-500 text-sm">Loading billing details...</span>
      </div>
    );
  }

  if (!currentTenant) {
    return (
      <div className="h-full flex flex-col bg-[#F5F5F7] dark:bg-gray-950 overflow-hidden">
        {/* Dynamic Header */}
        <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-[#F5F5F7] dark:bg-gray-955">
          <h1 className="text-base font-semibold text-gray-900 dark:text-white">
            Billing Management
          </h1>
        </div>

        {/* Main Workspace Body */}
        <div className="flex-1 overflow-y-auto min-h-0 px-8 py-12 flex flex-col items-center justify-center">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-black/10 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm text-center space-y-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <CreditCard className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Organization Billing
              </h2>
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                You are in Personal Mode. Personal subscription billing is managed under your account profile page.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push('/billing')}
                className="w-full text-xs font-semibold"
              >
                Go to Personal Billing
              </Button>
            </div>

            {tenants.length > 0 ? (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider text-left">
                  Manage Organization Billing
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-black/5 dark:border-zinc-800 rounded-lg p-1">
                  {tenants.map((tenant) => (
                    <button
                      key={tenant.id}
                      onClick={() => switchToTenantMode(tenant.id)}
                      className="w-full flex items-center justify-between p-2.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-sm text-left transition-colors"
                    >
                      <span className="font-medium text-gray-950 dark:text-white truncate">
                        {tenant.name}
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t border-black/5 dark:border-zinc-800">
                <Button
                  variant="default"
                  onClick={() => onOpen({ type: 'create-organization' })}
                  className="w-full gap-2 bg-black hover:bg-black/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-black"
                >
                  <Plus className="h-4 w-4" />
                  Create Organization
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <StripeProviderWithErrorBoundary>
      <div className="h-full flex flex-col bg-[#F5F5F7] dark:bg-gray-950 overflow-hidden">
        {/* Dynamic Header */}
        <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-[#F5F5F7] dark:bg-gray-955">
          <h1 className="text-base font-semibold text-gray-900 dark:text-white">
            Billing Management
          </h1>
        </div>

        {/* Main Workspace Body */}
        <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6">
          <div className="mt-4">
            <BillingFormContent />
          </div>
        </div>
      </div>
    </StripeProviderWithErrorBoundary>
  );
}
