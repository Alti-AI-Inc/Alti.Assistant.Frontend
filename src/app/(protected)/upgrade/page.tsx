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
            const products = productsRes.data as unknown as {
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
    <div className="flex min-h-screen flex-col px-6 py-12">
      <div className="container mx-auto max-w-7xl">
        <h1 className="mt-10 text-center text-5xl font-semibold tracking-tighter">
          Plans
        </h1>
        <p className="text-muted-foreground mt-4 text-center text-lg">
          Choose the perfect plan for your needs.
        </p>

        {loading ? (
          <div className="text-muted-foreground mt-20 flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading plans...</span>
          </div>
        ) : (
          <div className="mt-20">
            <OrganizationPricingCards
              onSelectPlan={handleSelectPlan}
              currentPlanId={currentPlanId}
              showContactSales={true}
            />
          </div>
        )}
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
      <UpgradePage />
    </StripeProviderWithErrorBoundary>
  );
}
