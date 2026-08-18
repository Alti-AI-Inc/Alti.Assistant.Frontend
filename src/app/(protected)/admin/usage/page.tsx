'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Search, Brain, Activity } from 'lucide-react';

export default function UsagePage() {
  const { data: session } = useSession();

  // Mock limits and usage data
  const planName = 'Pro Plan';
  const searchLimit = 1000;
  const currentSearches = 450;
  
  const researchLimit = 20;
  const currentResearch = 8;

  const monitorLimit = 100;
  const currentMonitors = 34;

  // Extra balances
  const extraSearchesRemaining = 400;
  const extraResearchRemaining = 3;

  const searchPercentage = Math.min(100, (currentSearches / searchLimit) * 100);
  const researchPercentage = Math.min(100, (currentResearch / researchLimit) * 100);
  const monitorPercentage = Math.min(100, (currentMonitors / monitorLimit) * 100);

  return (
    <div className="h-full flex flex-col bg-[#e1e1e1] dark:bg-gray-955 overflow-hidden">
      {/* Top Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-955">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Usage
        </h1>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6">
        <div className="mx-auto max-w-6xl space-y-8">
          
          {/* Top Bar / Current Month Progress Indicators */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Search Usage Card */}
              <Card className="bg-white/80 dark:bg-zinc-955/50 shadow-md border-black/5 dark:border-white/5 p-6 space-y-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Search</h3>
                  <div className="text-base font-bold text-gray-900 dark:text-white">
                    {currentSearches} / {searchLimit}
                  </div>
                </div>

                {/* Custom Progress Bar */}
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#0000ff] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${searchPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                  <span>{searchPercentage.toFixed(0)}% Used</span>
                  <span>Allowance resets on Sep 1, 2026</span>
                </div>
              </Card>

              {/* Research Usage Card */}
              <Card className="bg-white/80 dark:bg-zinc-955/50 shadow-md border-black/5 dark:border-white/5 p-6 space-y-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Research</h3>
                  <div className="text-base font-bold text-gray-900 dark:text-white">
                    {currentResearch} / {researchLimit}
                  </div>
                </div>

                {/* Custom Progress Bar */}
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#0000ff] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${researchPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                  <span>{researchPercentage.toFixed(0)}% Used</span>
                  <span>Allowance resets on Sep 1, 2026</span>
                </div>
              </Card>

              {/* Monitor Usage Card */}
              <Card className="bg-white/80 dark:bg-zinc-955/50 shadow-md border-black/5 dark:border-white/5 p-6 space-y-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Monitor</h3>
                  <div className="text-base font-bold text-gray-900 dark:text-white">
                    {currentMonitors} / {monitorLimit}
                  </div>
                </div>

                {/* Custom Progress Bar */}
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#0000ff] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${monitorPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                  <span>{monitorPercentage.toFixed(0)}% Used</span>
                  <span>Allowance resets on Sep 1, 2026</span>
                </div>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
