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
import { Loader2, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStripeProducts } from '@/actions/stripeActions';
import { motion } from 'framer-motion';

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="size-10 text-blue-500 animate-spin" />
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium tracking-wide animate-pulse">
          Fetching premium pricing structures...
        </p>
      </div>
    );
  }

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
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 items-stretch">
      {plans.map((plan, idx) => {
        const isCurrentPlan = currentPlanId === plan.id;

        return (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="flex h-full"
          >
            <Card
              className={cn(
                'relative flex flex-col w-full rounded-3xl overflow-hidden transition-all duration-300',
                'backdrop-blur-xl bg-white/60 dark:bg-zinc-950/60',
                plan.highlighted
                  ? 'border border-indigo-500/40 dark:border-indigo-500/50 shadow-[0_0_35px_rgba(99,102,241,0.1)] dark:shadow-[0_0_50px_rgba(99,102,241,0.15)]'
                  : 'border border-zinc-200/80 dark:border-zinc-800/80 shadow-xl',
                isCurrentPlan && 'border-emerald-500/50 ring-1 ring-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]'
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 right-6 z-10">
                  <span className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-3.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider rounded-full shadow-md shadow-indigo-500/10">
                    <Sparkles className="size-3 animate-pulse" /> Popular
                  </span>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute -top-3.5 left-6 z-10">
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 px-3 py-0.5 text-white border-none font-bold text-[10px] tracking-wider rounded-full shadow-md shadow-emerald-500/10">
                    Active Plan
                  </Badge>
                </div>
              )}

              <CardHeader className="pt-8 px-8 pb-4 text-center">
                <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{plan.name}</CardTitle>
                <CardDescription className="min-h-[3.5rem] mt-3 text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
                  {plan.description}
                </CardDescription>
                <div className="mt-6 flex items-baseline justify-center gap-1.5">
                  <span className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">${plan.price}</span>
                  <span className="text-zinc-500 dark:text-zinc-400 font-semibold text-base">{plan.period}</span>
                </div>
              </CardHeader>

              {/* Features list */}
              <div className="flex-1 px-8 py-6 border-t border-zinc-100 dark:border-zinc-800/60 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 text-left">
                  Core capabilities
                </p>
                <ul className="space-y-3.5">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-300 text-left"
                    >
                      <span className="flex-shrink-0 mt-0.5 rounded-full p-0.5 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <Check className="size-3.5 stroke-[3]" />
                      </span>
                      <span className="leading-snug">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <CardFooter className="pb-8 pt-4 px-8 border-t border-zinc-50 dark:border-zinc-900/40">
                {isCurrentPlan ? (
                  <Button
                    disabled={true}
                    className="w-full py-6 text-sm bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-650 font-bold border-none rounded-2xl cursor-not-allowed shadow-inner"
                  >
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => onSelectPlan?.(plan)}
                    className={cn(
                      'w-full py-6 text-sm font-extrabold tracking-wide transition-all duration-300 rounded-2xl border-none shadow-md',
                      plan.highlighted
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/10 hover:shadow-indigo-500/25 hover:scale-[1.02]'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 shadow-zinc-950/10 hover:scale-[1.02]'
                    )}
                  >
                    Choose {plan.name}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

