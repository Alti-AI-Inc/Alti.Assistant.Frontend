'use client';

import {
  OrganizationPricingCards,
  type OrganizationPlan,
} from '@/components/organizations/OrganizationPricingCards';
import { PaymentConfirmationModal } from '@/components/stripe/PaymentConfirmationModal';
import { StripeProviderWithErrorBoundary } from '@/components/stripe/StripeProvider';
import { useTenant } from '@/contexts/TenantContext';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminBillingPage() {
  const { currentTenant } = useTenant();
  
  // Safe cast since the context returns an abbreviated Tenant type locally,
  // but the full data object often contains these nested properties.
  const subscriptionPlan = 
    (currentTenant as any)?.subscription?.price?.plan || 
    (currentTenant as any)?.plan || 
    'free';
    
  const { data: session } = useSession();
  
  const [selectedPlan, setSelectedPlan] = useState<OrganizationPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleSelectPlan = (plan: OrganizationPlan) => {
    // Skip payment for free plan
    if (plan.id === 'free' || !plan.priceId) {
      toast.info('Free plan selected');
      return;
    }

    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
    toast.success('Payment successful! Your subscription has been updated.');
    window.location.reload();
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  return (
    <StripeProviderWithErrorBoundary>
      <div className="h-full flex flex-col bg-white dark:bg-gray-950 overflow-hidden">
        {/* Dynamic Header */}
        <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-950">
          <h1 className="text-base font-semibold text-gray-900 dark:text-white">
            Billing Management
          </h1>
        </div>

        {/* Main Workspace Body */}
        <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6">
          <div className="max-w-6xl mx-auto mt-4">
            <OrganizationPricingCards
              currentPlanId={subscriptionPlan.toLowerCase()}
              onSelectPlan={handleSelectPlan}
              showContactSales={true}
            />
          </div>

          {selectedPlan && (
            <PaymentConfirmationModal
              isOpen={showPaymentModal}
              onClose={handlePaymentCancel}
              onSuccess={handlePaymentSuccess}
              plan={{
                id: selectedPlan.id,
                name: selectedPlan.name,
                price: selectedPlan.price,
                priceId: selectedPlan.priceId!,
                interval: 'month',
              }}
            />
          )}
        </div>
      </div>
    </StripeProviderWithErrorBoundary>
  );
}
