'use client';
import { useState } from 'react';
import { Plus, Activity, Clock, Globe, Bell, CheckCircle2, ChevronRight, X, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const mockMonitors = [
  {
    id: 1,
    url: 'https://docs.anthropic.com/en/release-notes/overview',
    name: 'Anthropic Release Notes',
    frequency: 'Every 24 Hours',
    lastRun: '10 mins ago',
    status: 'active',
    changesDetected: 2,
  },
  {
    id: 2,
    url: 'https://openai.com/api/pricing/',
    name: 'OpenAI Pricing Tracker',
    frequency: 'Every 12 Hours',
    lastRun: '2 hours ago',
    status: 'active',
    changesDetected: 0,
  },
  {
    id: 3,
    url: 'https://github.com/langchain-ai/langchain/releases',
    name: 'LangChain Releases',
    frequency: 'Every 6 Hours',
    lastRun: '1 hour ago',
    status: 'paused',
    changesDetected: 5,
  }
];

export default function MonitorChangesPage() {
  const [monitors, setMonitors] = useState(mockMonitors);
  const [isCreating, setIsCreating] = useState(false);
  const [newUrl, setNewUrl] = useState('');

  const handleCreate = () => {
    if (!newUrl) return;
    setMonitors([{
      id: Date.now(),
      url: newUrl,
      name: newUrl.replace('https://', '').split('/')[0],
      frequency: 'Every 24 Hours',
      lastRun: 'Just now',
      status: 'active',
      changesDetected: 0
    }, ...monitors]);
    setNewUrl('');
    setIsCreating(false);
  };

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-[#111115]">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 px-6 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
          <Activity className="size-4 text-blue-500" />
          <span>Monitor Changes</span>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex h-8 items-center gap-2 rounded bg-blue-600 px-3 text-xs font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="size-3.5" />
          <span>New Monitor</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl">
          
          <div className="mb-8 rounded-lg border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
            <h2 className="mb-1 text-sm font-semibold text-blue-800 dark:text-blue-300">Omni-Extractor Monitors</h2>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Set up automated tracking on any website. Aphura uses ZenRows to bypass Cloudflare and JS-rendering walls, pulling the live DOM on a schedule and notifying you of semantic changes via Composio integrations.
            </p>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {isCreating && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50"
                >
                  <h3 className="mb-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">Create New Monitor</h3>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Globe className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="url"
                        placeholder="https://example.com/pricing"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="h-10 w-full rounded border border-zinc-200 bg-white pl-9 pr-4 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                      />
                    </div>
                    <button
                      onClick={handleCreate}
                      className="flex h-10 items-center justify-center rounded bg-zinc-800 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                      Start Tracking
                    </button>
                    <button
                      onClick={() => setIsCreating(false)}
                      className="flex h-10 w-10 items-center justify-center rounded border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {monitors.map((monitor) => (
              <div
                key={monitor.id}
                className="group flex cursor-pointer items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full border",
                    monitor.status === 'active' 
                      ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400"
                      : "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400"
                  )}>
                    {monitor.status === 'active' ? <Activity className="size-5" /> : <Clock className="size-5" />}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {monitor.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {monitor.url}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {monitor.frequency}
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="size-3.5" />
                        Last Run: {monitor.lastRun}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {monitor.changesDetected > 0 ? (
                    <div className="flex flex-col items-end">
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                        <Bell className="size-3.5 fill-amber-600/20" />
                        {monitor.changesDetected} Changes
                      </span>
                      <span className="mt-0.5 text-[10px] text-zinc-400">Review pending</span>
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-400">
                      No changes
                    </div>
                  )}

                  <div className="flex size-8 items-center justify-center rounded-full bg-zinc-50 text-zinc-400 group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-zinc-800 dark:group-hover:bg-zinc-800 dark:group-hover:text-blue-400">
                    <ChevronRight className="size-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
