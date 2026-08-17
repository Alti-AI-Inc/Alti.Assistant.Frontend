'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';

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
    name: 'Search',
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
    name: 'Research',
    price: '$5',
    unit: 'per 100 research reports',
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
  const [quantities, setQuantities] = useState<Record<string, number>>({
    search_addon: 1,
    research_addon: 1,
  });
  const [activePurchaseAddon, setActivePurchaseAddon] = useState<Addon | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Extra balances
  const extraSearchesRemaining = 400;
  const extraResearchRemaining = 3;

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
            {ADDONS.map((addon) => {
              const qty = quantities[addon.id] || 0;
              return (
                <Card
                  key={addon.id}
                  className="relative flex items-center justify-between p-6 bg-white/80 dark:bg-zinc-955/50 shadow-md border-black/5 dark:border-white/5 transition-all duration-300"
                >
                  {/* Left Side: Title and Pricing on One Row */}
                  <div className="flex items-center gap-4">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
                      {addon.name}
                    </h3>
                    <div className="flex items-baseline gap-1.5 border-l border-black/10 dark:border-white/10 pl-4">
                      <span className="text-base font-extrabold text-black dark:text-white">
                        {addon.price}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        {addon.id === 'search_addon' ? '/ per 100 search results' : '/ per 100 research reports'}
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Quantity Selector and Purchase Button */}
                  <div className="flex items-center gap-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3 bg-zinc-200/80 dark:bg-zinc-800 border border-black/5 dark:border-white/5 rounded-xl p-1 select-none">
                      <button
                        type="button"
                        onClick={() => setQuantities(prev => ({
                          ...prev,
                          [addon.id]: Math.max(0, (prev[addon.id] || 0) - 1)
                        }))}
                        className="size-8 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-zinc-650 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white active:scale-95 transition-all cursor-pointer font-bold text-base outline-none"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-black dark:text-white">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantities(prev => ({
                          ...prev,
                          [addon.id]: (prev[addon.id] || 0) + 1
                        }))}
                        className="size-8 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-zinc-650 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white active:scale-95 transition-all cursor-pointer font-bold text-base outline-none"
                      >
                        +
                      </button>
                    </div>

                    {/* Purchase Button */}
                    <button
                      type="button"
                      onClick={() => setActivePurchaseAddon(addon)}
                      className="px-5 h-[40px] flex items-center justify-center text-xs font-semibold bg-black hover:bg-zinc-900 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black rounded-xl transition-all cursor-pointer active:scale-95 duration-200"
                    >
                      Purchase
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Extra Balances Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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
      </div>

      {/* iOS-Style Success/Confirmation Dialog (Same style/design as logout popup) */}
      <Dialog
        open={activePurchaseAddon !== null}
        onOpenChange={() => {
          setActivePurchaseAddon(null);
          setIsSuccess(false);
        }}
      >
        <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[480px] sm:max-w-[480px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden animate-in fade-in duration-200">
          {!isSuccess ? (
            <>
              {/* Centered Content Section */}
              <div className="px-5 pt-5 pb-4 text-center">
                <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
                  Purchase {activePurchaseAddon?.name}
                </h2>
                <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1">
                  Are you sure you want to purchase{' '}
                  {activePurchaseAddon?.id === 'search_addon'
                    ? `${(quantities[activePurchaseAddon?.id || ''] || 1) * 100} searches`
                    : `${(quantities[activePurchaseAddon?.id || ''] || 1) * 100} research reports`}{' '}
                  for ${(quantities[activePurchaseAddon?.id || ''] || 1) * (activePurchaseAddon?.id === 'search_addon' ? 2 : 5)}?
                </p>
              </div>

              {/* Extended Border & iOS Layout Action Buttons */}
              <div className="border-t border-black/10 dark:border-white/10 flex h-11">
                {/* Cancel Option */}
                <button
                  onClick={() => setActivePurchaseAddon(null)}
                  className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center border-r border-black/10 dark:border-white/10 outline-none cursor-pointer"
                >
                  Cancel
                </button>
                
                {/* Confirm Option */}
                <button
                  onClick={() => setIsSuccess(true)}
                  className="flex-1 text-[15px] font-normal text-blue-655 dark:text-blue-400 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none cursor-pointer"
                >
                  Purchase
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Centered Content Section */}
              <div className="px-5 pt-5 pb-4 text-center">
                <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
                  {activePurchaseAddon?.id === 'search_addon' ? 'Search Purchased' : 'Research Purchased'}
                </h2>
                <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1">
                  {activePurchaseAddon?.id === 'search_addon'
                    ? `${(quantities[activePurchaseAddon?.id || ''] || 1) * 100} searches have been added to your account.`
                    : `${(quantities[activePurchaseAddon?.id || ''] || 1) * 100} research reports have been added to your account.`}
                </p>
              </div>

              {/* Extended Border & iOS Layout Action Buttons */}
              <div className="border-t border-black/10 dark:border-white/10 flex h-11">
                {/* Close Option */}
                <button
                  onClick={() => {
                    setActivePurchaseAddon(null);
                    setIsSuccess(false);
                  }}
                  className="flex-1 text-[15px] font-normal text-blue-655 dark:text-blue-400 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none cursor-pointer"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
