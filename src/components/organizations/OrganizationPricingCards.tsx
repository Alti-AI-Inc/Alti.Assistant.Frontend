'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Loader2 } from 'lucide-react';
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

export function OrganizationPricingCards({
  onSelectPlan,
  currentPlanId,
  showContactSales = true,
}: OrganizationPricingCardsProps) {
  const { data: session } = useSession();
  const [plans, setPlans] = useState<OrganizationPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      const accessToken = session?.accessToken;
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getStripeProducts(accessToken);

        if (response.success && response.data) {
          // Map API response to OrganizationPlan format
          // Cast response data to ApiProduct[] since the actual API returns different format than StripeProduct
          const mappedPlans: OrganizationPlan[] = (response.data as unknown as ApiProduct[])
            .filter((product) => product.isVisible && product.isActive)
            .sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999))
            .map((product) => ({
              id: product.plan,
              name: product.displayName || product.name,
              price: product.price,
              priceId: product.stripePriceId,
              period: `/${product.interval || 'month'}`,
              description: product.description || '',
              features: product.featuresList || [],
              limitations: product.plan === 'free' ? ['No Team Collaboration'] : undefined,
              requestLimit: product.features?.dailyWebSearchLimit,
              storagePerUser: 0,
              highlighted: product.plan === 'execute', // Highlight Execute plan
              popular: product.plan === 'explore', // Mark Explore as popular
            }));

          setPlans(mappedPlans);
        } else {
          setError(response.message || 'Failed to load plans');
        }
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Failed to load pricing plans');
      } finally {
        setLoading(false);
      }
    }

    fetchPlans();
  }, [session?.accessToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading pricing plans...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No pricing plans available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {plans.map((plan) => {
        const isCurrentPlan = currentPlanId === plan.id;

        return (
          <Card
            key={plan.id}
            className={cn(
              'relative flex flex-col transition-all hover:shadow-lg',
              plan.highlighted && 'border-primary border-2 shadow-xl scale-105',
              isCurrentPlan && 'border-green-500 border-2'
            )}
          >
            {plan.popular && !isCurrentPlan && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-3 py-1">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            {isCurrentPlan && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-green-500 text-white px-3 py-1">
                  Current Plan
                </Badge>
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="min-h-[3rem]">
                {plan.description}
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature) => {
                  const isLimitation = plan.limitations?.includes(feature);
                  return (
                    <li
                      key={feature}
                      className={cn(
                        'flex items-start gap-2',
                        isLimitation && 'text-muted-foreground line-through'
                      )}
                    >
                      <Check
                        className={cn(
                          'w-5 h-5 mt-0.5 flex-shrink-0',
                          isLimitation
                            ? 'text-muted-foreground/50'
                            : plan.highlighted
                            ? 'text-primary'
                            : 'text-green-600'
                        )}
                      />
                      <span className="text-sm">{feature}</span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                onClick={() => onSelectPlan?.(plan)}
                disabled={isCurrentPlan}
                className={cn(
                  'w-full',
                  plan.highlighted &&
                    'bg-primary hover:bg-primary/90 text-primary-foreground',
                  isCurrentPlan && 'opacity-50 cursor-not-allowed'
                )}
                variant={plan.highlighted ? 'default' : 'outline'}
              >
                {isCurrentPlan
                  ? 'Current Plan'
                  : plan.id === 'command' && showContactSales
                  ? 'Contact Sales'
                  : plan.id === 'free'
                  ? 'Start Free Trial'
                  : 'Upgrade'}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
