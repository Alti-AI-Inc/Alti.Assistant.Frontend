'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
}

const ALL_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Starter',
    price: 'Free',
    period: ' (One-time trial)',
    description: 'Test out Inso Search’s capabilities with basic search and model limits.',
    features: [
      '100 Search',
      '10 Research',
      '10 Monitor',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '$10',
    period: '/mo',
    description: 'For casual users looking for more queries and standard model access.',
    features: [
      '500 Search',
      '50 Research',
      '50 Monitor',
    ],
  },
  {
    id: 'individual',
    name: 'Individual',
    price: '$20',
    period: '/mo',
    description: 'For developers requiring advanced reasoning and deep research.',
    features: [
      '1,000 Search',
      '100 Research',
      '100 Monitor',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$50',
    period: '/mo',
    description: 'For small teams needing collaborative workspaces and higher limits.',
    features: [
      '2,500 Search',
      '250 Research',
      '250 Monitor',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: '$100',
    period: '/mo',
    description: 'Uncapped search throughput and enterprise-grade models.',
    features: [
      '5,000 Search',
      '500 Research',
      '500 Monitor',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$200',
    period: '/mo',
    description: 'For large-scale operations requiring maximum throughput and limits.',
    features: [
      '10,000 Search',
      '1,000 Research',
      '1,000 Monitor',
    ],
  },
];

export default function PlansPage() {
  const { data: session } = useSession();
  const { currentTenant } = useTenant();
  const [hideTrial, setHideTrial] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPlanId, setCurrentPlanId] = useState('free');
  
  // Custom Confirmation Dialog States
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const isCreator = !currentTenant || currentTenant.role === 'owner' || currentTenant.role === 'admin';

  useEffect(() => {
    const checkSubscriptionAndTrial = async () => {
      if (!session?.accessToken) {
        setIsLoading(false);
        return;
      }
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.insosearch.com/api/v1';
        const res = await fetch(`${apiUrl}/auth/user/single-user`, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const body = await res.json();
          if (body?.success && body?.data) {
            const user = body.data;
            const isSubscribed = user.isSubscribed;
            const promptsUsed = user.freePlanUsage?.promptsUsed ?? 0;
            const imagesUsed = user.freePlanUsage?.imagesUsed ?? 0;

            // Hide trial if subscribed OR trial usage limits have been reached
            if (isSubscribed || promptsUsed >= 100 || imagesUsed >= 1) {
              setHideTrial(true);
            }
          }
        }
      } catch (err) {
        console.error('Failed to check user subscription status:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscriptionAndTrial();
  }, [session]);

  return (
    <div className="h-full flex flex-col bg-[#e1e1e1] dark:bg-gray-955 overflow-hidden">
      {/* Top Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-955">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Plans
        </h1>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          </div>
        ) : (
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4">
              {ALL_PLANS.filter((p) => !(p.id === 'free' && hideTrial)).map((plan) => {
                const isFree = plan.id === 'free';
                const displayPrice = isFree ? 'FREE' : plan.price;
                const displayPeriod = isFree ? '/trial' : '/month';
                
                return (
                  <Card
                    key={plan.id}
                    className="w-full p-5 bg-white/80 dark:bg-zinc-950/50 shadow-md border-black/5 dark:border-white/5 transition-all duration-300 hover:-translate-y-0.5 rounded-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Left Column: Pricing */}
                      <div className="w-[200px] shrink-0">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-extrabold tracking-tight uppercase text-gray-900 dark:text-white">
                            {displayPrice}
                          </span>
                          <span className="text-zinc-500 dark:text-zinc-400 font-medium text-[10px] tracking-wider">
                            {displayPeriod}
                          </span>
                        </div>
                      </div>

                      {/* Middle Column: Features on one row, left-aligned */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex flex-wrap items-center gap-1.5 justify-start">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              {idx > 0 && <span className="text-zinc-400 font-normal">&bull;</span>}
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Column: Select / Current Plan buttons for creator only */}
                      {isCreator && (
                        <div className="shrink-0 flex items-center justify-end w-[130px]">
                          {plan.id === currentPlanId ? (
                            <button
                              type="button"
                              className="w-full h-9 rounded-md text-xs font-bold bg-black text-white dark:bg-white dark:text-black hover:opacity-90 active:scale-95 transition-all cursor-pointer border border-transparent"
                            >
                              Current Plan
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPlan(plan);
                                setIsPopupOpen(true);
                                setIsConfirmed(false);
                              }}
                              className="w-full h-9 rounded-md text-xs font-bold bg-[#0000ff] text-white hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                            >
                              Select Plan
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* iOS / Logout-Style Confirmation Dialog */}
      {selectedPlan && (
        <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
          <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[270px] sm:max-w-[270px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
            {/* Centered Content Section */}
            <div className="px-5 pt-5 pb-4 text-center">
              {!isConfirmed ? (
                <>
                  <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
                    {selectedPlan.name}
                  </h2>
                  <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1">
                    {selectedPlan.features.join(' • ')}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
                    {selectedPlan.name} Plan Selected
                  </h2>
                  <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1">
                    Your plan has been updated.
                  </p>
                </>
              )}
            </div>

            {/* Extended Border & iOS Layout Action Buttons */}
            <div className="border-t border-black/10 dark:border-white/10 flex h-11">
              {!isConfirmed ? (
                <>
                  {/* Cancel Option */}
                  <button
                    type="button"
                    onClick={() => setIsPopupOpen(false)}
                    className="flex-1 text-[15px] font-normal text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center border-r border-black/10 dark:border-white/10 outline-none cursor-pointer"
                  >
                    Cancel
                  </button>
                  
                  {/* Select Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPlanId(selectedPlan.id);
                      setIsConfirmed(true);
                      toast.success(`Selected ${selectedPlan.name} plan`);
                    }}
                    className="flex-1 text-[15px] font-semibold text-[#0000ff] hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none cursor-pointer"
                  >
                    Select
                  </button>
                </>
              ) : (
                /* Close Option */
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                  className="flex-1 text-[15px] font-semibold text-[#0000ff] hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none cursor-pointer"
                >
                  Close
                </button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
