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
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex min-h-screen flex-col px-6 py-12 relative overflow-hidden"
    >
      {/* Decorative premium aura background glows */}
      <div className="absolute top-0 left-1/4 size-[400px] rounded-full bg-blue-500/5 dark:bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 size-[400px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto mt-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
            Upgrade Your Intelligence
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg leading-relaxed">
            Choose the perfect plan to unlock safe recursive deep research, multi-agent workspaces, and real-time knowledge graphs.
          </p>
        </div>

        <div className="mt-16 sm:mt-24">
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
    </motion.div>
  );
}

export default function UpgradePageWithStripe() {
  return (
    <StripeProviderWithErrorBoundary>
      <UpgradePage />
    </StripeProviderWithErrorBoundary>
  );
}
