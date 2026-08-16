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
import { Check, Plus } from 'lucide-react';

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

const ALL_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free Starter',
    price: 'Free',
    period: '',
    description: 'Test out Alti’s capabilities with basic search and model limits.',
    features: [
      '50 Searches / day',
      '1 Deep Research report / day',
    ],
    highlighted: false,
    popular: false,
    buttonText: 'Active Plan',
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '$10',
    period: '/mo',
    description: 'For casual users looking for more queries and standard model access.',
    features: [
      '500 Searches / day',
      '5 Deep Research reports / day',
    ],
    highlighted: false,
    popular: false,
    buttonText: 'Upgrade',
  },
  {
    id: 'individual',
    name: 'Individual',
    price: '$20',
    period: '/mo',
    description: 'For developers requiring advanced reasoning and deep research.',
    features: [
      '1,000 Searches / day',
      '10 Deep Research reports / day',
    ],
    highlighted: false,
    popular: false,
    buttonText: 'Upgrade',
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$50',
    period: '/mo',
    description: 'For small teams needing collaborative workspaces and higher limits.',
    features: [
      '2,500 Searches / day',
      '25 Deep Research reports / day',
    ],
    highlighted: true,
    popular: true,
    buttonText: 'Upgrade',
  },
  {
    id: 'business',
    name: 'Business',
    price: '$100',
    period: '/mo',
    description: 'Uncapped search throughput and enterprise-grade models.',
    features: [
      '5,000 Searches / day',
      '50 Deep Research reports / day',
    ],
    highlighted: false,
    popular: false,
    buttonText: 'Upgrade',
  },
];

interface Addon {
  id: string;
  name: string;
  price: string;
  unit: string;
  description: string;
  features: string[];
}

const ADDONS: Addon[] = [
  {
    id: 'search_addon',
    name: 'Search Add-on',
    price: '$2',
    unit: 'per 100 searches',
    description: 'Need extra real-time search queries? Top up your search limit instantly.',
    features: [
      'Integrate real-time web results',
      'Add-on queries never expire',
      'Usable across any of your workspaces',
    ],
  },
  {
    id: 'research_addon',
    name: 'Research Add-on',
    price: '$2',
    unit: 'per report',
    description: 'Execute deep research cycles that generate comprehensive reports.',
    features: [
      'Comprehensive agentic search runs',
      'Detailed analytical report output',
      'Advanced reasoning model access',
    ],
  },
];

export default function PlansPage() {
  const { data: session } = useSession();
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
        <div className="mx-auto max-w-7xl space-y-12">
          {/* Header text */}
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Flexible tiers for teams and individuals
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Choose the best fit for your workload. Upgrade or downgrade at any time.
            </p>
          </div>

          {/* 5 Plans in One Row on Large Screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {ALL_PLANS.map((plan) => {
              const isCurrentPlan = activePlanId === plan.id;

              return (
                <Card
                  key={plan.id}
                  className={cn(
                    'relative flex flex-col transition-all duration-300 hover:-translate-y-1 p-4',
                    plan.highlighted
                      ? 'bg-white/80 dark:bg-zinc-950/50 shadow-xl border-blue-500 border-2 ring-1 ring-blue-500/30 dark:border-blue-500'
                      : 'bg-white/80 dark:bg-zinc-950/50 shadow-md border-black/5 dark:border-white/5',
                    isCurrentPlan && 'border-green-500 dark:border-green-500 ring-1 ring-green-500/30'
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 right-3">
                      <Badge className="bg-blue-500 hover:bg-blue-600 px-2 py-0.5 text-white shadow-sm border-none font-semibold text-[8px] tracking-wide uppercase">
                        Popular
                      </Badge>
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <Badge className="bg-green-500 hover:bg-green-600 px-2 py-0.5 text-white shadow-md border-none font-semibold text-[9px] tracking-wide">
                        Current
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="p-0 pt-4 pb-3 flex-none">
                    <CardTitle className="text-sm font-bold tracking-tight text-center">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="min-h-[2.5rem] mt-1 text-zinc-500 dark:text-zinc-400 leading-normal text-[10px] text-center">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-2 flex items-baseline justify-center gap-0.5">
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
                    <div className="border-t border-black/5 dark:border-white/5 my-2.5" />
                    <ul className="space-y-1.5 text-[10px] text-zinc-600 dark:text-zinc-400">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="h-3 w-3 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="p-0 pt-2 pb-2 flex-none">
                    <Button
                      disabled={isCurrentPlan}
                      className={cn(
                        'w-full py-3.5 text-[10px] font-bold tracking-wide transition-all shadow-md',
                        plan.highlighted
                          ? 'bg-blue-600 hover:bg-blue-700 text-white border-none'
                          : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white border-none',
                        isCurrentPlan &&
                          'bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600 shadow-none'
                      )}
                      variant="default"
                    >
                      {isCurrentPlan ? 'Active' : plan.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Add-ons Divider & Title */}
          <div className="pt-6 border-t border-black/10 dark:border-white/10 space-y-4 max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                Enhance your workflow with Add-ons
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Purchase top-ups directly to get more searches and analytical reports.
              </p>
            </div>

            {/* Two Add-on Cards below the grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              {ADDONS.map((addon) => (
                <Card
                  key={addon.id}
                  className="relative flex flex-col p-6 bg-white/80 dark:bg-zinc-950/50 shadow-md border-black/5 dark:border-white/5 transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader className="p-0 pb-4 flex-none">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <CardTitle className="text-base font-bold tracking-tight">
                          {addon.name}
                        </CardTitle>
                        <CardDescription className="mt-1 text-zinc-500 dark:text-zinc-400 leading-normal text-xs">
                          {addon.description}
                        </CardDescription>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-3xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
                          {addon.price}
                        </div>
                        <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                          {addon.unit}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 p-0 pb-6">
                    <div className="border-t border-black/5 dark:border-white/5 my-3" />
                    <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                      {addon.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="p-0 pt-2 flex-none">
                    <Button
                      className="w-full py-5 text-xs font-bold tracking-wide transition-all shadow-md bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white border-none flex items-center justify-center gap-1.5"
                      variant="default"
                    >
                      <Plus className="h-4 w-4" /> Add to Plan
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
