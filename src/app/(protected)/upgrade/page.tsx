'use client';

import {
  getMyPersonalSubscription,
  getStripeProducts,
} from '@/actions/stripeActions';
import {
  OrganizationPricingCards,
  type OrganizationPlan,
} from '@/components/organizations/OrganizationPricingCards';
import { PaymentConfirmationModal } from '@/components/stripe/PaymentConfirmationModal';
import StripeProviderWithErrorBoundary from '@/components/stripe/StripeProvider';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import SpacesLayout from '@/components/sidebars/SpacesLayout';

function UpgradePage() {
  const { data: session } = useSession();
  const [currentPlanId, setCurrentPlanId] = useState<string | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<OrganizationPlan | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const accessToken = session?.accessToken;
      if (!accessToken) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [productsRes, subRes] = await Promise.all([
          getStripeProducts(accessToken),
          getMyPersonalSubscription(accessToken),
        ]);

        if (subRes.success && subRes.data?.dbRecord?.stripePriceId) {
          const currentPriceId = subRes.data.dbRecord.stripePriceId;
          if (productsRes.success && productsRes.data) {
            const rawProducts = productsRes.data;
            const products = (Array.isArray(rawProducts)
              ? rawProducts
              : (rawProducts && typeof rawProducts === 'object' && 'products' in rawProducts && Array.isArray((rawProducts as any).products)
                ? (rawProducts as any).products
                : [])) as unknown as {
                stripePriceId: string;
                plan: string;
              }[];
            const currentProduct = products.find(
              p => p.stripePriceId === currentPriceId,
            );
            setCurrentPlanId(currentProduct?.plan);
          }
        }
      } catch (err) {
        console.error('Error loading upgrade data:', err);
        setError('Failed to load upgrade plans. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [session?.accessToken]);

  const handleSelectPlan = (plan: OrganizationPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    window.location.reload();
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-950 overflow-hidden">
      {/* Dynamic Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-950">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Pricing Plans
        </h1>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-12 flex flex-col justify-center">
        <div className="container mx-auto max-w-7xl my-auto">
          <OrganizationPricingCards
            onSelectPlan={handleSelectPlan}
            currentPlanId={currentPlanId}
            showContactSales={true}
          />
        </div>
      </div>

      {selectedPlan && (
        <PaymentConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
          plan={{
            id: selectedPlan.id,
            name: selectedPlan.name,
            price: selectedPlan.price,
            priceId: selectedPlan.priceId || '',
            interval: selectedPlan.period === '/year' ? 'year' : 'month',
          }}
        />
      )}
    </div>
  );
}

export default function UpgradePageWithStripe() {
  return (
    <StripeProviderWithErrorBoundary>
      <SpacesLayout showColumnPanels={false}>
        <UpgradePage />
      </SpacesLayout>
    </StripeProviderWithErrorBoundary>
  );
}
