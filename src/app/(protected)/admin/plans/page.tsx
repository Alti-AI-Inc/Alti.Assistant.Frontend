'use client';

import PaymentConfirmationModal from '@/components/stripe/PaymentConfirmationModal';
import StripeProviderWithErrorBoundary from '@/components/stripe/StripeProvider';
import { Card } from '@/components/ui/card';
import { useTenant } from '@/contexts/TenantContext';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[
  {
    id: 'managed-storage',
    name: 'Managed Storage',
    price: '$1',
    period: '/mo per GB',
    description:
      'Enterprise-grade RAG indexing and embedding storage powered by Together AI.',
    features: ['Vector Storage', 'Real-time inference indexing'],
  },
];
}

const ALL_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Starter',
    price: '$5',
    period: '/mo',
    description:
      'Test out Aphura’s capabilities with basic search and model limits.',
    features: ['250 Prompts'],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '$10',
    period: '/mo',
    description:
      'For casual users looking for more queries and standard model access.',
    features: ['500 Prompts'],
  },
  {
    id: 'individual',
    name: 'Individual',
    price: '$20',
    period: '/mo',
    description:
      'For developers requiring advanced reasoning and deep research.',
    features: ['1,000 Prompts'],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$50',
    period: '/mo',
    description:
      'For small teams needing collaborative workspaces and higher limits.',
    features: ['2,500 Prompts'],
  },
  {
    id: 'business',
    name: 'Business',
    price: '$100',
    period: '/mo',
    description: 'Uncapped search throughput and enterprise-grade models.',
    features: ['5,000 Prompts'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$200',
    period: '/mo',
    description:
      'For large-scale operations requiring maximum throughput and limits.',
    features: ['10,000 Prompts'],
  },
  {
    id: 'institutional',
    name: 'Institutional',
    price: '$500',
    period: '/mo',
    description:
      'Dedicated capacity and premier throughput for high-volume institutions.',
    features: ['25,000 Prompts'],
  },
];

export default function PlansPage() {
  const { currentTenant } = useTenant();
  const [currentPlanId, setCurrentPlanId] = useState('free');

  // Custom Confirmation Dialog States
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const isCreator =
    !currentTenant ||
    currentTenant.role === 'owner' ||
    currentTenant.role === 'admin';

  // Restore persisted selection so hard-refresh preserves the chosen plan
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('alti:selectedPlanId');
        if (stored) setCurrentPlanId(stored);
      }
    } catch (err) {
      // ignore localStorage errors
    }
  }, []);

  return (
    <div className="dark:bg-gray-955 flex h-full flex-col overflow-hidden bg-[#e1e1e1]">
      {/* Top Header */}
      <div className="dark:bg-gray-955 flex h-[52px] flex-none items-center border-b border-black/10 bg-white px-8 dark:border-white/10">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Plans
        </h1>
      </div>

      {/* Main Workspace Body */}
      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4">
              {ALL_PLANS.map(
                plan => {
                  const displayPrice = plan.price;
                  const displayPeriod = '/month';

                  return (
                    <Card
                      key={plan.id}
                      className="w-full rounded-[5px] border-black/5 bg-white/80 p-5 shadow-md transition-all duration-300 hover:-translate-y-0.5 dark:border-white/5 dark:bg-zinc-950/50"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Left Column: Pricing */}
                        <div className="w-[200px] shrink-0">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-extrabold tracking-tight text-gray-900 uppercase dark:text-white">
                              {displayPrice}
                            </span>
                            <span className="text-[10px] font-medium tracking-wider text-zinc-500 dark:text-zinc-400">
                              {displayPeriod}
                            </span>
                          </div>
                        </div>

                        {/* Middle Column: Features on one row, left-aligned */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-start gap-1.5 text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {plan.features.map((feature, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1.5"
                              >
                                {idx > 0 && (
                                  <span className="font-normal text-zinc-400">
                                    &bull;
                                  </span>
                                )}
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Right Column: Select / Current Plan buttons for creator only */}
                        {isCreator && (
                          <div className="flex w-[130px] shrink-0 items-center justify-end">
                            {plan.id === currentPlanId ? (
                              <button
                                type="button"
                                className="h-9 w-full cursor-pointer rounded-[3px] border border-transparent bg-[#0000ff] text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
                              >
                                Current Plan
                              </button>
                            ) : (
                              (() => {
                                const isDisabled = Boolean(
                                  currentPlanId &&
                                    currentPlanId !== 'free' &&
                                    currentPlanId !== plan.id,
                                );
                                return (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (isDisabled) return;
                                      setSelectedPlan(plan);
                                      setIsPopupOpen(true);
                                      setIsConfirmed(false);
                                    }}
                                    disabled={isDisabled}
                                    aria-disabled={isDisabled}
                                    className={`h-9 w-full rounded-[3px] text-xs font-bold ${isDisabled ? 'cursor-not-allowed bg-zinc-200 text-zinc-400' : 'bg-black text-white hover:opacity-90 active:scale-95 dark:bg-white dark:text-black'} transition-all`}
                                  >
                                    Select Plan
                                  </button>
                                );
                              })()
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                },
              )}
            </div>
          </div>
      </div>

      {/* Real Stripe payment modal */}
      {selectedPlan && (
        <StripeProviderWithErrorBoundary>
          <PaymentConfirmationModal
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            onSuccess={() => {
              setCurrentPlanId(selectedPlan.id);
              try {
                if (typeof window !== 'undefined') {
                  localStorage.setItem('alti:selectedPlanId', selectedPlan.id);
                }
              } catch (e) {
                // ignore storage errors
              }
              setIsConfirmed(true);
              setIsPopupOpen(false);
              toast.success(`Selected ${selectedPlan.name} plan`);
            }}
            plan={{
              id: selectedPlan.id,
              name: selectedPlan.name,
              price: selectedPlan.price,
              priceId: '',
              interval: 'month',
            }}
          />
        </StripeProviderWithErrorBoundary>
      )}
    </div>
  );
}
