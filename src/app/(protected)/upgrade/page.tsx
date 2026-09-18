'use client';

import {
  getMyPersonalSubscription,
  getStripeProducts,
} from '@/actions/stripeActions';
import {
  OrganizationPricingCards,
  type OrganizationPlan,
} from '@/components/organizations/OrganizationPricingCards';
import SpacesLayout from '@/components/sidebars/SpacesLayout';
import { PaymentConfirmationModal } from '@/components/stripe/PaymentConfirmationModal';
import StripeProviderWithErrorBoundary from '@/components/stripe/StripeProvider';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

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
              : rawProducts &&
                  typeof rawProducts === 'object' &&
                  'products' in rawProducts &&
                  Array.isArray((rawProducts as any).products)
                ? (rawProducts as any).products
                : []) as unknown as {
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
    <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-gray-950">
      {/* Dynamic Header */}
      <div className="flex h-[52px] flex-none items-center border-b border-black/10 bg-white px-8 dark:border-white/10 dark:bg-gray-950">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Pricing Plans
        </h1>
      </div>

      {/* Main Workspace Body */}
      <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-8 py-12">
        <div className="container mx-auto my-auto max-w-7xl">
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
            price: String(selectedPlan.price),
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
