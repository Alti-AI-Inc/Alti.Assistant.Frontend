'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check, Loader2 } from 'lucide-react';

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
    description: 'Test out Alti’s capabilities with basic search and model limits.',
    features: [
      '100 Search',
      '1 Research',
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
      '5 Research',
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
      '10 Research',
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
      '25 Research',
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
      '50 Research',
    ],
  },
];

export default function PlansPage() {
  const { data: session } = useSession();
  const [hideTrial, setHideTrial] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSubscriptionAndTrial = async () => {
      if (!session?.accessToken) {
        setIsLoading(false);
        return;
      }
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.altihq.com/api/v1';
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

  const renderPlanCard = (plan: PricingPlan) => {
    return (
      <Card
        key={plan.id}
        className="relative flex flex-col transition-all duration-300 hover:-translate-y-1 p-4 bg-white/80 dark:bg-zinc-950/50 shadow-md border-black/5 dark:border-white/5"
      >
        <CardHeader className="p-0 pt-3 pb-1 flex-none">
          <CardTitle className="text-sm font-bold tracking-tight text-center">
            {plan.name}
          </CardTitle>
          <div className="mt-1 flex items-baseline justify-center gap-0.5">
            <span className="text-2xl font-extrabold tracking-tight">
              {plan.price}
            </span>
            {plan.period && (
              <span className="text-zinc-500 dark:text-zinc-400 font-medium text-[10px]">
                {plan.period}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 pb-4">
          <div className="border-t border-black/10 dark:border-white/10 -mx-4 mt-1.5 mb-3" />
          <ul className="space-y-2 text-sm text-black dark:text-black font-semibold">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-black dark:bg-black flex-shrink-0" />
                <span className="leading-tight">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };

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
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Top Row: Starter Free Trial */}
            {!hideTrial && (
              <Card className="w-full p-5 bg-white/80 dark:bg-zinc-950/50 shadow-md border-black/5 dark:border-white/5 transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Left Side: Name and Pricing */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
                      Starter
                    </h2>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-extrabold tracking-tight">
                        Free
                      </span>
                      <span className="text-zinc-500 dark:text-zinc-400 font-medium text-[10px]">
                        (One-time trial)
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Features */}
                  <div className="text-sm font-semibold text-black dark:text-black flex items-center gap-1.5">
                    <span>100 Search</span>
                    <span className="text-zinc-400 font-normal">&bull;</span>
                    <span>1 Research</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Bottom Row: Active Monthly Plans */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {ALL_PLANS.filter((p) => p.id !== 'free').map((plan) =>
                  renderPlanCard(plan)
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
