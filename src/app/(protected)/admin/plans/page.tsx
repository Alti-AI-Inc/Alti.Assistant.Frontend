'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  popular: boolean;
  buttonText: string;
}

const FREE_PLAN: PricingPlan = {
  id: 'free',
  name: 'Free Starter',
  price: 'Free',
  period: '',
  description: 'Test out Alti’s core capabilities with basic search and model limits.',
  features: [
    'Single user access',
    '50 AI requests per day',
    'Basic Web Search',
    '1GB secure cloud storage',
    'Community forum support',
  ],
  highlighted: false,
  popular: false,
  buttonText: 'Current Plan',
};

const GRID_PLANS: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$10',
    period: '/month',
    description: 'Perfect for casual users looking for more queries and standard model access.',
    features: [
      'Single user access',
      '500 AI requests per day',
      'Full Web Search',
      '5GB secure cloud storage',
      'Standard email support',
    ],
    highlighted: false,
    popular: false,
    buttonText: 'Upgrade to Basic',
  },
  {
    id: 'individual',
    name: 'Individual',
    price: '$20',
    period: '/month',
    description: 'For developers and power users requiring advanced reasoning and deep research.',
    features: [
      'Single user access',
      '1,500 AI requests per day',
      'Full Web Search & Deep Research',
      '15GB secure cloud storage',
      'Standard email support',
    ],
    highlighted: false,
    popular: false,
    buttonText: 'Upgrade to Individual',
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$50',
    period: '/month',
    description: 'Designed for small teams and professionals needing collaborative workspaces and higher throughput.',
    features: [
      'Collaborative workspace (up to 3 users)',
      '3,500 AI requests per day',
      'Advanced Multi-Modal RAG',
      '30GB cloud storage per user',
      'Invite and manage team members',
      'Priority email support',
    ],
    highlighted: true,
    popular: true,
    buttonText: 'Upgrade to Professional',
  },
  {
    id: 'business',
    name: 'Business',
    price: '$100',
    period: '/month',
    description: 'Uncapped search throughput, team-wide knowledge sharing, and enterprise-grade models.',
    features: [
      'Unlimited seats',
      '10,000 AI requests per day',
      'Advanced Vertex & DeepSeek models',
      '100GB secure cloud storage per user',
      'Advanced analytics & security settings',
      'Dedicated 24/7 priority support',
    ],
    highlighted: false,
    popular: false,
    buttonText: 'Upgrade to Business',
  },
];

const ENTERPRISE_PLAN: PricingPlan = {
  id: 'enterprise',
  name: 'Enterprise',
  price: 'Custom',
  period: '',
  description: 'Tailored limits, dedicated models, and custom SLA for organizations.',
  features: [
    'Unlimited seats',
    'Unlimited AI requests',
    'Dedicated Gemini/Vertex models',
    'Custom storage capacity',
    'SAML SSO & advanced security',
    'Dedicated account manager',
  ],
  highlighted: false,
  popular: false,
  buttonText: 'Contact Sales',
};

export default function PlansPage() {
  const { data: session } = useSession();
  // Assume a default user has the free starter plan active for UI visual indication
  const activePlanId = 'free';

  return (
    <div className="h-full flex flex-col bg-[#e1e1e1] dark:bg-gray-955 overflow-hidden">
      {/* Top Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-955">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Plans
        </h1>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Flexible tiers for teams and individuals
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Choose the best fit for your workload. Upgrade or downgrade at any time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan - Spans full width on desktop */}
            <div className="md:col-span-2">
              <Card
                className={cn(
                  'relative flex flex-col transition-all duration-300 hover:-translate-y-1',
                  'bg-white/80 dark:bg-zinc-950/50 shadow-md border-black/5 dark:border-white/5',
                  activePlanId === 'free' && 'border-green-500 dark:border-green-500 ring-1 ring-green-500/30'
                )}
              >
                {activePlanId === 'free' && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-green-500 hover:bg-green-600 px-3 py-1 text-white shadow-md border-none font-semibold tracking-wide">
                      Current Plan
                    </Badge>
                  </div>
                )}

                <CardHeader className="pt-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="text-left">
                      <CardTitle className="text-2xl font-bold tracking-tight">
                        {FREE_PLAN.name}
                      </CardTitle>
                      <CardDescription className="mt-1 text-zinc-500 dark:text-zinc-400 leading-relaxed text-xs">
                        {FREE_PLAN.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-baseline md:justify-end gap-1">
                      <span className="text-4xl font-extrabold tracking-tight">
                        {FREE_PLAN.price}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pb-6">
                  <div className="border-t border-black/5 dark:border-white/5 my-3" />
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                    {FREE_PLAN.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pb-6 pt-2">
                  <Button
                    disabled={activePlanId === 'free'}
                    className={cn(
                      'w-full py-5 text-xs font-bold tracking-wide transition-all shadow-md',
                      'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white border-none',
                      activePlanId === 'free' &&
                        'bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600 shadow-none'
                    )}
                    variant="default"
                  >
                    Active Plan
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Other 4 Plans in 2x2 Grid */}
            {GRID_PLANS.map((plan) => {
              const isCurrentPlan = activePlanId === plan.id;

              return (
                <Card
                  key={plan.id}
                  className={cn(
                    'relative flex flex-col transition-all duration-300 hover:-translate-y-1',
                    plan.highlighted
                      ? 'bg-white/80 dark:bg-zinc-950/50 shadow-xl border-blue-500 border-2 ring-1 ring-blue-500/30 dark:border-blue-500'
                      : 'bg-white/80 dark:bg-zinc-950/50 shadow-md border-black/5 dark:border-white/5',
                    isCurrentPlan && 'border-green-500 dark:border-green-500 ring-1 ring-green-500/30'
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 right-4">
                      <Badge className="bg-blue-500 hover:bg-blue-600 px-3 py-0.5 text-white shadow-sm border-none font-semibold text-[10px] tracking-wide uppercase">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-green-500 hover:bg-green-600 px-3 py-1 text-white shadow-md border-none font-semibold tracking-wide">
                        Current Plan
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pt-8">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="min-h-[3rem] mt-2 text-zinc-500 dark:text-zinc-400 leading-relaxed text-xs text-center">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4 flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-extrabold tracking-tight">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-zinc-500 dark:text-zinc-400 font-medium text-xs">
                          {plan.period}
                        </span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 pb-6">
                    <div className="border-t border-black/5 dark:border-white/5 my-4" />
                    <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pb-8 pt-4">
                    <Button
                      disabled={isCurrentPlan}
                      className={cn(
                        'w-full py-5 text-xs font-bold tracking-wide transition-all shadow-md',
                        plan.highlighted
                          ? 'bg-blue-600 hover:bg-blue-700 text-white border-none'
                          : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white border-none',
                        isCurrentPlan &&
                          'bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600 shadow-none'
                      )}
                      variant="default"
                    >
                      {isCurrentPlan ? 'Active Plan' : plan.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}

            {/* Enterprise Plan - Spans full width on desktop at the bottom */}
            <div className="md:col-span-2">
              <Card
                className={cn(
                  'relative flex flex-col transition-all duration-300 hover:-translate-y-1',
                  'bg-white/80 dark:bg-zinc-950/50 shadow-md border-black/5 dark:border-white/5'
                )}
              >
                <CardHeader className="pt-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="text-left">
                      <CardTitle className="text-2xl font-bold tracking-tight">
                        {ENTERPRISE_PLAN.name}
                      </CardTitle>
                      <CardDescription className="mt-1 text-zinc-500 dark:text-zinc-400 leading-relaxed text-xs">
                        {ENTERPRISE_PLAN.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-baseline md:justify-end gap-1">
                      <span className="text-4xl font-extrabold tracking-tight">
                        {ENTERPRISE_PLAN.price}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pb-6">
                  <div className="border-t border-black/5 dark:border-white/5 my-3" />
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                    {ENTERPRISE_PLAN.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pb-6 pt-2">
                  <Button
                    className={cn(
                      'w-full py-5 text-xs font-bold tracking-wide transition-all shadow-md',
                      'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white border-none'
                    )}
                    variant="default"
                  >
                    {ENTERPRISE_PLAN.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
