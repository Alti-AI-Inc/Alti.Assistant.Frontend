'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export const organizationPlans = [
  {
    id: 'free',
    name: 'Free Trial',
    price: 0,
    priceId: null, // No Stripe price ID for free tier
    period: '/mo',
    description: 'Perfect for trying out our platform',
    features: [
      '10 requests/day',
      'Basic AI features',
      'Community support',
      'No Team Collaboration',
      '1 user only',
    ],
    limitations: ['No Team Collaboration'],
    requestLimit: 10,
    storagePerUser: 0,
    highlighted: false,
    popular: false,
  },
  {
    id: 'explore',
    name: 'Explore Plan',
    price: 20,
    priceId: 'price_explore', // Replace with actual Stripe price ID
    period: '/mo',
    description: 'Great for small teams getting started',
    features: [
      '1,000 requests/day',
      'Basic Text Document RAG',
      '10GB storage per user',
      'Invite Your Team',
      'Email support',
      'Team collaboration tools',
    ],
    requestLimit: 1000,
    storagePerUser: 10,
    highlighted: false,
    popular: true,
  },
  {
    id: 'execute',
    name: 'Execute Plan',
    price: 50,
    priceId: 'price_execute', // Replace with actual Stripe price ID
    period: '/mo',
    description: 'Ideal for growing teams with advanced needs',
    features: [
      '5,000 requests/day',
      'Advanced Multi-Modal RAG',
      '50GB storage per user',
      'Invite Your Team',
      'Priority email support',
      'Advanced analytics',
      'Custom integrations',
    ],
    requestLimit: 5000,
    storagePerUser: 50,
    highlighted: true,
    popular: false,
  },
  {
    id: 'command',
    name: 'Command Plan',
    price: 100,
    priceId: 'price_command', // Replace with actual Stripe price ID
    period: '/mo',
    description: 'Built for enterprise-scale operations',
    features: [
      '15,000 requests/day',
      'Premium Agentic RAG',
      '100GB storage per user',
      'Invite Your Team',
      'Dedicated support',
      'Advanced security features',
      'Custom workflows',
      'API access',
      'SLA guarantees',
    ],
    requestLimit: 15000,
    storagePerUser: 100,
    highlighted: false,
    popular: false,
  },
];

interface OrganizationPricingCardsProps {
  onSelectPlan?: (planId: string) => void;
  currentPlanId?: string;
  showContactSales?: boolean;
}

export function OrganizationPricingCards({
  onSelectPlan,
  currentPlanId,
  showContactSales = true,
}: OrganizationPricingCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {organizationPlans.map((plan) => {
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
                onClick={() => onSelectPlan?.(plan.id)}
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
