'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { getStripeProducts } from '@/actions/stripeActions';

// API Product type from backend
interface ApiProduct {
  _id: string;
  plan: string;
  name: string;
  displayName?: string;
  description: string;
  price: number;
  interval: string;
  stripePriceId: string;
  stripeProductId: string;
  currency: string;
  isActive: boolean;
  isVisible: boolean;
  sortOrder: number;
  featuresList: string[];
  features: {
    dailyWebSearchLimit?: number;
    dailyDeepResearchLimit?: number;
    canInviteTeam?: boolean;
    unlimitedSeats?: boolean;
  };
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationPlan {
  id: string;
  name: string;
  price: number;
  priceId: string | null;
  period: string;
  description: string;
  features: string[];
  limitations?: string[];
  requestLimit?: number;
  storagePerUser?: number;
  highlighted: boolean;
  popular: boolean;
}

interface OrganizationPricingCardsProps {
  onSelectPlan?: (plan: OrganizationPlan) => void;
  currentPlanId?: string;
  showContactSales?: boolean;
}

const DEFAULT_PLANS: OrganizationPlan[] = [
  {
    id: 'explore',
    name: 'Individual',
    price: 20,
    priceId: 'price_1SvD4aKunQzDWl59VdfdTeqZ',
    period: '/month',
    description: 'Perfect for individual developers and researchers looking to supercharge their workflow.',
    features: [
      'Single user workspace',
      '1,000 AI requests per day',
      'Basic Text Document RAG',
      '10GB secure cloud storage',
      'Web search & deep research tools',
      'Standard email support',
    ],
    highlighted: false,
    popular: false,
  },
  {
    id: 'execute',
    name: 'Team',
    price: 25,
    priceId: 'price_1SvD4bKunQzDWl59UQwqGLMD',
    period: '/month',
    description: 'Collaborate with your team with shared knowledge bases, higher limits, and advanced AI capabilities.',
    features: [
      'Collaborative team workspace',
      '5,000 AI requests per day',
      'Advanced Multi-Modal RAG',
      '50GB shared storage per user',
      'Invite and manage team members',
      'Web search & deep research tools',
      'Priority 24/7 email support',
      'Advanced usage analytics',
    ],
    highlighted: true,
    popular: true,
  },
];

export function OrganizationPricingCards({
  onSelectPlan,
  currentPlanId,
  showContactSales = true,
}: OrganizationPricingCardsProps) {
  const { data: session } = useSession();
  const [plans, setPlans] = useState<OrganizationPlan[]>(DEFAULT_PLANS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      const accessToken = session?.accessToken;
      if (!accessToken) {
        // Fall back to default plans statically when logged out
        setPlans(DEFAULT_PLANS);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getStripeProducts(accessToken);

        if (response.success && response.data) {
          const rawProducts = response.data;
          const apiProducts = (Array.isArray(rawProducts)
            ? rawProducts
            : (rawProducts && typeof rawProducts === 'object' && 'products' in rawProducts && Array.isArray((rawProducts as any).products)
              ? (rawProducts as any).products
              : [])) as ApiProduct[];
          
          // Map backend products but keep our requested pricing/branding perfectly aligned
          const mappedPlans = DEFAULT_PLANS.map(defaultPlan => {
            const matchedApiProduct = apiProducts.find(
              p => p.plan === defaultPlan.id
            );

            if (matchedApiProduct) {
              return {
                ...defaultPlan,
                priceId: matchedApiProduct.stripePriceId || defaultPlan.priceId,
              };
            }
            return defaultPlan;
          });

          setPlans(mappedPlans);
        }
      } catch (err) {
        console.error('Error fetching dynamic plans, using defaults:', err);
        // Silently fall back to default plans so the UI never breaks
        setPlans(DEFAULT_PLANS);
      } finally {
        setLoading(false);
      }
    }

    fetchPlans();
  }, [session?.accessToken]);



  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
      {plans.map((plan, index) => {
        const isCurrentPlan = currentPlanId === plan.id;
        const isPopular = plan.popular;

        return (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 15,
              delay: index * 0.15,
            }}
            whileHover={{ y: -8, scale: 1.01 }}
            className="flex flex-col h-full"
          >
            <Card
              className={cn(
                'relative flex flex-col h-full transition-all duration-300 border backdrop-blur-xl',
                'bg-white/30 dark:bg-zinc-950/20 border-white/20 dark:border-zinc-800/80 shadow-2xl',
                isPopular && 'border-indigo-500/50 ring-2 ring-indigo-500/20 dark:border-indigo-500',
                isCurrentPlan && 'border-emerald-500/50 ring-2 ring-emerald-500/20 shadow-emerald-500/5 dark:border-emerald-500',
              )}
            >
              {isCurrentPlan && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 px-4 py-1 text-white shadow-lg border-none font-bold tracking-wider text-xs">
                    Current Plan
                  </Badge>
                </div>
              )}
              
              {!isCurrentPlan && isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-indigo-600 hover:bg-indigo-700 px-4 py-1 text-white shadow-lg border-none font-bold tracking-wider text-xs uppercase animate-pulse">
                    Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="pt-10 pb-6">
                <CardTitle className="text-3xl font-extrabold tracking-tight text-center bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                  {plan.name}
                </CardTitle>
                <CardDescription className="min-h-[3rem] mt-3 text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm text-center px-4">
                  {plan.description}
                </CardDescription>
                <div className="mt-8 flex items-baseline justify-center gap-1">
                  <span className="text-6xl font-black tracking-tighter bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">${plan.price}</span>
                  <span className="text-zinc-500 dark:text-zinc-400 font-semibold text-base">{plan.period}</span>
                </div>
              </CardHeader>

              {/* Dynamic Feature Checklist */}
              <div className="flex-1 px-8 py-6 border-t border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                        <svg
                          className="h-3.5 w-3.5 stroke-[3]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <CardFooter className="pb-10 pt-8 px-8">
                <Button
                  onClick={() => onSelectPlan?.(plan)}
                  disabled={isCurrentPlan}
                  className={cn(
                    'w-full py-7 text-sm font-bold tracking-wide transition-all shadow-lg hover:shadow-indigo-500/25 border-none rounded-xl cursor-pointer',
                    'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white',
                    isCurrentPlan && 'bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800/50 dark:text-zinc-600 shadow-none hover:shadow-none hover:bg-none bg-none',
                  )}
                  variant="default"
                >
                  {isCurrentPlan
                    ? 'Active Plan'
                    : 'Upgrade Now'}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
