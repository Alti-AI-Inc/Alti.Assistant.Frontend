'use client';

import { Button } from '@/components/ui/button';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { 
  PanelLeftClose, 
  Search, 
  Inbox,
  Trash2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function GlobalInboxSidebar() {
  const { isGlobalInboxOpen, setGlobalInboxOpen } = useSidebarStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [runs, setRuns] = useState<any[]>([]);

  // Fetch runs for Inbox
  useEffect(() => {
    const fetchRuns = () => {
      const savedRuns = localStorage.getItem('alti_task_runs');
      if (savedRuns) {
        setRuns(JSON.parse(savedRuns));
      } else {
        setRuns([]);
      }
    };

    fetchRuns();
    if (isGlobalInboxOpen) {
      const interval = setInterval(fetchRuns, 1000);
      return () => clearInterval(interval);
    }
  }, [isGlobalInboxOpen]);

  const handleClearRuns = () => {
    localStorage.removeItem('alti_task_runs');
    setRuns([]);
    toast.success('Run history cleared');
  };

  // Filter runs logs
  const filteredRuns = runs.filter(run => 
    run.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    run.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={cn(
        "flex-none flex flex-col border-l border-black/10 h-full overflow-hidden transition-all duration-300 ease-in-out z-30 bg-[#F9FAFB] dark:bg-zinc-950",
        isGlobalInboxOpen ? "w-76" : "w-0 border-l-0"
      )}
    >
      <div className="flex-1 flex flex-col min-h-0 p-4 space-y-4 w-76">
        {/* Floating Search Bar */}
        <div className="relative flex items-center h-12 w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 px-4 shadow-sm focus-within:ring-2 focus-within:ring-black/5 transition-all">
          <Search className="size-4 text-gray-400 mr-2 flex-none" />
          <input
            type="text"
            placeholder="Search Inbox..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-black dark:text-white outline-none placeholder:text-gray-400"
          />
          {/* Close/Back button to return to AI tab */}
          <button
            onClick={() => {
              setGlobalInboxOpen(false);
            }}
            className="ml-2 p-1.5 rounded-lg text-gray-400 hover:bg-black/5 hover:text-black dark:hover:bg-white/5 dark:hover:text-white transition-colors flex-none"
            title="Close Inbox"
          >
            <PanelLeftClose className="size-4" />
          </button>
        </div>

        {/* Execution Logs Header / Clear History */}
        <div className="flex items-center justify-between px-1 flex-none">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider select-none">Execution Logs</span>
          {runs.length > 0 && (
            <button 
              onClick={handleClearRuns} 
              className="text-[10px] text-zinc-400 hover:text-red-500 transition-colors font-medium"
            >
              Clear History
            </button>
          )}
        </div>

        {/* Inbox List Area */}
        <div className="flex-1 overflow-y-auto space-y-3 min-h-0 pr-1 pb-4">
          {filteredRuns.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-400 select-none">
              {searchQuery ? 'No matching executions.' : 'No executions yet. Run a task to see logs.'}
            </div>
          ) : (
            filteredRuns.map((run) => (
              <div 
                key={run.id}
                className="w-full bg-white dark:bg-zinc-900 rounded-xl p-4 space-y-2 border border-black/[0.06] dark:border-white/[0.06] shadow-xs hover:shadow-sm transition-shadow duration-150"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-gray-955 dark:text-white text-xs truncate">
                    {run.taskName}
                  </span>
                  <span className={cn(
                    "text-[9px] font-bold px-2 py-0.5 rounded-md border select-none shrink-0",
                    run.status === 'running' && "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 animate-pulse",
                    run.status === 'success' && "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
                    run.status === 'failed' && "bg-rose-500/10 text-rose-600 dark:text-rose-455 border-rose-500/20"
                  )}>
                    {run.status === 'running' ? 'Running' : run.status === 'success' ? 'Success' : 'Failed'}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                  {run.summary}
                </p>
                
                <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 text-[10px] text-gray-400">
                  <span>{new Date(run.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                  {run.duration && <span>{Math.round(run.duration / 100) / 10}s</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
