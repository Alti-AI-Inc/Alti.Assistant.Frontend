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

export default function AddonsPage() {
  const { data: session } = useSession();

  return (
    <div className="h-full flex flex-col bg-[#e1e1e1] dark:bg-gray-955 overflow-hidden">
      {/* Top Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-955">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Extras
        </h1>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Two Add-on Cards */}
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

                <CardContent className="flex-1 p-0">
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
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
