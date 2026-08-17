'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Search, Brain, History, Sparkles, Calendar } from 'lucide-react';

interface MonthlyUsage {
  month: string;
  searches: number;
  research: number;
}

const HISTORIC_USAGE: MonthlyUsage[] = [
  { month: 'July 2026', searches: 890, research: 14 },
  { month: 'June 2026', searches: 950, research: 18 },
  { month: 'May 2026', searches: 410, research: 5 },
  { month: 'April 2026', searches: 320, research: 2 },
];

export default function UsagePage() {
  const { data: session } = useSession();

  // Mock limits and usage data
  const planName = 'Pro Plan';
  const searchLimit = 1000;
  const currentSearches = 450;
  
  const researchLimit = 20;
  const currentResearch = 8;

  // Extra balances
  const extraSearchesRemaining = 400;
  const extraResearchRemaining = 3;

  const searchPercentage = Math.min(100, (currentSearches / searchLimit) * 100);
  const researchPercentage = Math.min(100, (currentResearch / researchLimit) * 100);

  return (
    <div className="h-full flex flex-col bg-[#e1e1e1] dark:bg-gray-955 overflow-hidden">
      {/* Top Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-955 justify-between">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Usage
        </h1>
        <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full border border-black/5 dark:border-white/5">
          Current Plan: {planName}
        </span>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6">
        <div className="mx-auto max-w-4xl space-y-8">
          
          {/* Top Bar / Current Month Progress Indicators */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-zinc-500" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Current Month Usage (August 2026)
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Search Usage Card */}
              <Card className="bg-white/80 dark:bg-zinc-955/50 shadow-md border-black/5 dark:border-white/5 p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Search Queries</h3>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {currentSearches} <span className="text-sm font-normal text-zinc-500">/ {searchLimit}</span>
                    </div>
                  </div>
                  <div className="p-2 bg-blue-500/10 dark:bg-blue-400/10 rounded-lg">
                    <Search className="h-5 w-5 text-blue-650 dark:text-blue-400" />
                  </div>
                </div>

                {/* Custom Progress Bar */}
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-650 dark:bg-blue-400 h-full rounded-full transition-all duration-500" 
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
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Research Reports</h3>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {currentResearch} <span className="text-sm font-normal text-zinc-500">/ {researchLimit}</span>
                    </div>
                  </div>
                  <div className="p-2 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-lg">
                    <Brain className="h-5 w-5 text-indigo-650 dark:text-indigo-400" />
                  </div>
                </div>

                {/* Custom Progress Bar */}
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-650 dark:bg-indigo-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${researchPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                  <span>{researchPercentage.toFixed(0)}% Used</span>
                  <span>Allowance resets on Sep 1, 2026</span>
                </div>
              </Card>
            </div>
          </div>

          {/* Extras / Add-on Balances */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-zinc-500" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Purchased Extras (Never Expire)
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Extra Searches Balance */}
              <Card className="bg-white/80 dark:bg-zinc-955/50 shadow-md border-black/5 dark:border-white/5 p-5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Extra Search Queries</h4>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {extraSearchesRemaining} remaining
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-200/80 dark:bg-zinc-800 text-black dark:text-white rounded-lg border border-black/5 dark:border-white/5">
                  Search Add-on
                </span>
              </Card>

              {/* Extra Research Balance */}
              <Card className="bg-white/80 dark:bg-zinc-955/50 shadow-md border-black/5 dark:border-white/5 p-5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Extra Research Reports</h4>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {extraResearchRemaining} remaining
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-200/80 dark:bg-zinc-800 text-black dark:text-white rounded-lg border border-black/5 dark:border-white/5">
                  Research Add-on
                </span>
              </Card>
            </div>
          </div>

          {/* Historic Monthly Usage History */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <History className="h-4 w-4 text-zinc-500" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Previous Months History
              </h2>
            </div>

            <Card className="bg-white/80 dark:bg-zinc-955/50 shadow-md border-black/5 dark:border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-black/5 dark:divide-white/5 text-left text-xs">
                  <thead className="bg-zinc-50 dark:bg-zinc-900/60 text-zinc-500 dark:text-zinc-400 font-semibold">
                    <tr>
                      <th className="px-6 py-4">Billing Cycle</th>
                      <th className="px-6 py-4">Searches Conducted</th>
                      <th className="px-6 py-4">Research Cycles</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5 text-gray-900 dark:text-zinc-300">
                    {HISTORIC_USAGE.map((item, idx) => (
                      <tr key={idx} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                          {item.month}
                        </td>
                        <td className="px-6 py-4">
                          {item.searches}
                        </td>
                        <td className="px-6 py-4">
                          {item.research}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
