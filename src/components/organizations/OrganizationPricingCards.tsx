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
    period: '/user/month',
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
      <div className="flex items-center justify-center py-20">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <span className="text-muted-foreground ml-3 font-medium">
          Loading plans...
        </span>
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
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
      {plans.map(plan => {
        const isCurrentPlan = currentPlanId === plan.id;

        return (
          <Card
            key={plan.id}
            className={cn(
              'relative flex flex-col transition-all duration-300 hover:-translate-y-1',
              'bg-white/80 dark:bg-zinc-950/50 shadow-xl border-blue-500 border-2 ring-1 ring-blue-500/30 dark:border-blue-500',
              isCurrentPlan && 'border-green-500 ring-1 ring-green-500/30 shadow-lg',
            )}
          >
            {isCurrentPlan && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-green-500 hover:bg-green-600 px-3 py-1 text-white shadow-md border-none font-semibold tracking-wide">
                  Current Plan
                </Badge>
              </div>
            )}

            <CardHeader className="pt-8">
              <CardTitle className="text-3xl font-bold tracking-tight text-center">{plan.name}</CardTitle>
              <CardDescription className="min-h-[3rem] mt-2 text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm text-center">
                {plan.description}
              </CardDescription>
              <div className="mt-6 flex items-baseline justify-center gap-1">
                <span className="text-5xl font-extrabold tracking-tight">${plan.price}</span>
                <span className="text-zinc-500 dark:text-zinc-400 font-medium text-base">{plan.period}</span>
              </div>
            </CardHeader>

            <CardFooter className="pb-8 pt-4">
              <Button
                onClick={() => onSelectPlan?.(plan)}
                disabled={isCurrentPlan}
                className={cn(
                  'w-full py-6 text-sm font-bold tracking-wide transition-all shadow-md',
                  'bg-blue-600 hover:bg-blue-700 text-white border-none',
                  isCurrentPlan && 'bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600 shadow-none',
                )}
                variant="default"
              >
                {isCurrentPlan
                  ? 'Active Plan'
                  : 'Select Plan'}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
