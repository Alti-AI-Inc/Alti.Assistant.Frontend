'use client';

import { useSession } from 'next-auth/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

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
    period: '',
    description: 'Test out Alti’s capabilities with basic search and model limits.',
    features: [
      '50 Search',
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

  return (
    <div className="h-full flex flex-col bg-[#e1e1e1] dark:bg-gray-955 overflow-hidden">
      {/* Top Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-955">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Plans
        </h1>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-4">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* 5 Plans in One Row on Large Screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {ALL_PLANS.map((plan) => {
              return (
                <Card
                  key={plan.id}
                  className="relative flex flex-col transition-all duration-300 hover:-translate-y-1 p-4 bg-white/80 dark:bg-zinc-950/50 shadow-md border-black/5 dark:border-white/5"
                >
                  <CardHeader className="p-0 pt-4 pb-3 flex-none">
                    <CardTitle className="text-sm font-bold tracking-tight text-center">
                      {plan.name}
                    </CardTitle>
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
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
