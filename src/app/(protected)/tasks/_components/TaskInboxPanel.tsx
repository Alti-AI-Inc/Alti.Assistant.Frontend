'use client';

import React, { useState } from 'react';
import { 
  PanelRightClose,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface TaskRun {
  id: string;
  taskName: string;
  timestamp: string;
  status: 'running' | 'success' | 'failed';
  duration?: number; // in ms
  summary: string;
}

interface TaskInboxPanelProps {
  isOpen: boolean;
  runs: TaskRun[];
  onViewLogs: (taskName: string) => void;
  onClearRuns: () => void;
  onClose: () => void;
  onOpen: () => void;
}

export default function TaskInboxPanel({
  isOpen,
  runs,
  onViewLogs,
  onClearRuns,
  onClose,
  onOpen
}: TaskInboxPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopySummary = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Summary copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (taskName: string) => {
    toast.success(`Downloading report for ${taskName}...`, {
      description: 'Report downloaded successfully.'
    });
  };

  // Filter runs based on search input
  const filteredRuns = runs.filter(run => 
    run.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    run.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn(
      "h-full bg-white dark:bg-zinc-900 border-l border-black/10 dark:border-zinc-800/80 flex flex-col shrink-0 transition-all duration-300 ease-in-out relative",
      isOpen ? "w-76" : "w-10"
    )}>
      {/* Panel Header */}
      <div className={cn(
        "h-[52px] flex items-center justify-between border-b border-black/10 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 transition-colors duration-300 shrink-0",
        isOpen ? "px-4" : "px-0"
      )}>
        {isOpen ? (
          <>
            {/* Collapse Icon on top left */}
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              title="Collapse Panel"
            >
              <PanelRightClose className="size-5 text-gray-600 dark:text-zinc-400" />
            </button>

            {/* Title "Inbox" on top right */}
            <span className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider select-none">
              Inbox
            </span>
          </>
        ) : (
          /* Centered Open/Expand Icon when collapsed */
          <button
            onClick={onOpen}
            className="w-full flex justify-center p-1 text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            title="Expand Panel"
          >
            <PanelRightClose className="size-5 text-gray-600 dark:text-zinc-400 rotate-180" />
          </button>
        )}
      </div>

      {/* Search Bar - Only visible when open */}
      {isOpen && (
        <div className="px-5 pt-4 pb-1 shrink-0 bg-white dark:bg-zinc-900">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-gray-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search runs..."
              className="w-full bg-gray-50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Runs Feed */}
      <div className={cn(
        "flex-1 overflow-y-auto p-5 space-y-3.5 bg-white dark:bg-zinc-900",
        !isOpen && "hidden"
      )}>
        {filteredRuns.map((run) => (
          <div 
            key={run.id}
            className="bg-gray-50/50 dark:bg-zinc-800/40 rounded-xl p-3.5 space-y-2.5 relative overflow-hidden"
          >
            {run.status === 'running' && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-500/20 overflow-hidden">
                <div className="h-full bg-indigo-500 animate-[shimmer_1.5s_infinite] w-[40%]" />
              </div>
            )}

            {/* Title & Status */}
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-gray-900 dark:text-white text-xs truncate">
                {run.taskName}
              </span>
              <span className={cn(
                "text-[9px] font-bold px-1.5 py-0.5 rounded-md border select-none shrink-0",
                run.status === 'running' && "bg-indigo-500/10 text-indigo-655 dark:text-indigo-400 border-indigo-500/20 animate-pulse",
                run.status === 'success' && "bg-emerald-500/10 text-emerald-655 dark:text-emerald-455 border-emerald-500/20",
                run.status === 'failed' && "bg-rose-500/10 text-rose-655 dark:text-rose-455 border-rose-500/20"
              )}>
                {run.status === 'running' ? 'Running' : run.status === 'success' ? 'Success' : 'Failed'}
              </span>
            </div>

            {/* Summary Text (flat, directly inside card) */}
            <p className="text-[11px] text-gray-600 dark:text-zinc-400 leading-relaxed">
              {run.summary}
            </p>

            {/* Footer Row (Time + Actions aligned) */}
            <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-zinc-800/80 text-[10px] text-gray-400 dark:text-zinc-500 font-medium">
              <span>
                {new Date(run.timestamp).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewLogs(run.taskName)}
                  className="hover:text-black dark:hover:text-white transition-colors"
                >
                  Logs
                </button>
                <span>•</span>
                <button
                  onClick={() => handleCopySummary(run.id, run.summary)}
                  className="hover:text-black dark:hover:text-white transition-colors"
                >
                  {copiedId === run.id ? 'Copied' : 'Copy'}
                </button>
                {run.status === 'success' && (
                  <>
                    <span>•</span>
                    <button
                      onClick={() => handleDownload(run.taskName)}
                      className="hover:text-black dark:hover:text-white transition-colors"
                    >
                      Report
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredRuns.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-black/10 dark:border-white/10 rounded-2xl min-h-[200px] bg-gray-50 dark:bg-zinc-800/20">
            <span className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider select-none mb-1">
              {searchQuery ? 'No matches found' : 'No runs recorded'}
            </span>
            <p className="text-[10px] text-gray-500 dark:text-zinc-400 max-w-[180px] leading-relaxed">
              {searchQuery ? 'Try adjusting your search keywords.' : 'Create an automated task and check this feed for results.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
