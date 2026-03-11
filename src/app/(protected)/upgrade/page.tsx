'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import StripeProviderWithErrorBoundary from '@/components/stripe/StripeProvider';
import { PaymentConfirmationModal } from '@/components/stripe/PaymentConfirmationModal';
import { getStripeProducts, getMyPersonalSubscription } from '@/actions/stripeActions';

interface DbProduct {
  _id: string;
  plan: string;
  name: string;
  displayName: string;
  price: number;
  stripePriceId: string;
  features: {
    dailyRequestLimit: number;
    ragType: string;
    canInviteTeam: boolean;
  };
  featuresList: string[];
  interval: 'month' | 'year';
  isActive: boolean;
  isVisible: boolean;
  sortOrder: number;
}

interface SelectedPlan {
  id: string;
  name: string;
  price: number;
  priceId: string;
  interval?: 'month' | 'year';
}

function UpgradePage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [currentPriceId, setCurrentPriceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const accessToken = session?.accessToken;
      if (!accessToken) return;

      setLoading(true);
      try {
        const [productsRes, subRes] = await Promise.all([
          getStripeProducts(accessToken),
          getMyPersonalSubscription(accessToken),
        ]);

        if (productsRes.success && productsRes.data) {
          const sorted = (productsRes.data as unknown as DbProduct[])
            .filter(p => p.isVisible && p.isActive)
            .sort((a, b) => a.sortOrder - b.sortOrder);
          setProducts(sorted);
        }

        if (subRes.success && subRes.data?.dbRecord?.stripePriceId) {
          setCurrentPriceId(subRes.data.dbRecord.stripePriceId);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [session?.accessToken]);

  const handleSelectPlan = (product: DbProduct) => {
    setSelectedPlan({
      id: product._id,
      name: product.displayName || product.name,
      price: product.price,
      priceId: product.stripePriceId,
      interval: product.interval,
    });
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <h1 className="mt-10 text-center text-5xl font-semibold tracking-tighter">
        Upgrade Plan
      </h1>

      {loading ? (
        <div className="mt-20 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading plans...</span>
        </div>
      ) : (
        <div className="mx-auto mt-20 grid w-full max-w-[940px] grid-cols-1 gap-5 lg:grid-cols-3">
          {products.map(product => {
            const isCurrent = product.stripePriceId === currentPriceId;
            return (
              <div
                key={product._id}
                className="bg-secondary rounded-lg p-6"
              >
                <h3 className="text-lg font-medium">
                  {product.displayName || product.name}
                </h3>
                <p className="mt-2 text-4xl font-bold">
                  ${product.price}{' '}
                  <span className="text-muted-foreground text-sm font-medium">
                    /{product.interval || 'month'}
                  </span>
                </p>
                <Button
                  size="lg"
                  disabled={isCurrent}
                  onClick={() => !isCurrent && handleSelectPlan(product)}
                  className={cn(
                    'mt-4 mb-8 w-full shadow-none',
                    isCurrent
                      ? 'bg-blue-600 text-white cursor-default hover:bg-blue-600'
                      : 'bg-white text-black hover:bg-white hover:text-black',
                  )}
                >
                  {isCurrent ? 'Current Plan' : 'Select Plan'}
                </Button>
                <ul className="space-y-2">
                  {product.featuresList?.map(feature => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-1 h-4 w-4 text-gray-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {selectedPlan && (
        <PaymentConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
          plan={selectedPlan}
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

