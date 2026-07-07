'use client';

import { Search, Inbox, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SpaceInboxViewProps {
  botId: string;
}

export default function SpaceInboxView({ botId }: SpaceInboxViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [runs, setRuns] = useState<any[]>([]);

  // Fetch runs for this space
  useEffect(() => {
    const fetchRuns = () => {
      const savedRuns = localStorage.getItem('alti_task_runs');
      if (savedRuns) {
        try {
          const allRuns = JSON.parse(savedRuns);
          // Filter runs by botId
          setRuns(allRuns.filter((r: any) => r.botId === botId));
        } catch (e) {
          setRuns([]);
        }
      } else {
        setRuns([]);
      }
    };

    fetchRuns();
    const interval = setInterval(fetchRuns, 1000);
    return () => clearInterval(interval);
  }, [botId]);

  const filteredRuns = runs.filter(run => 
    run.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    run.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClearSpaceRuns = () => {
    const savedRuns = localStorage.getItem('alti_task_runs');
    if (savedRuns) {
      try {
        const allRuns = JSON.parse(savedRuns);
        // Keep runs that do not belong to this botId
        const updatedRuns = allRuns.filter((r: any) => r.botId !== botId);
        localStorage.setItem('alti_task_runs', JSON.stringify(updatedRuns));
        setRuns([]);
        toast.success('Space inbox history cleared');
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#e1e1e1] dark:bg-zinc-955 p-6 space-y-4 overflow-hidden">
      {/* Floating Search Bar */}
      <div className="relative flex items-center h-12 w-full max-w-4xl mx-auto rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 px-4 shadow-sm focus-within:ring-2 focus-within:ring-black/5 transition-all flex-none">
        <Search className="size-4 text-gray-400 mr-2 flex-none" />
        <input
          type="text"
          placeholder="Search Inbox..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-sm text-black dark:text-white outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Header with Clear Action */}
      {runs.length > 0 && (
        <div className="flex items-center justify-end max-w-4xl mx-auto w-full px-1 flex-none">
          <button 
            onClick={handleClearSpaceRuns} 
            className="text-xs text-zinc-400 hover:text-red-500 transition-colors font-medium"
          >
            Clear Space History
          </button>
        </div>
      )}

      {/* Inbox List Area */}
      <div className="flex-1 overflow-y-auto space-y-3 min-h-0 max-w-4xl mx-auto w-full pb-8">
        {filteredRuns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 select-none">
            <div className="size-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-400 dark:text-zinc-500">
              <Inbox className="size-6" />
            </div>
            <p className="text-xs text-gray-400 dark:text-zinc-500">
              {searchQuery ? 'No matching executions.' : 'No executions for this space yet. Run a task to see logs.'}
            </p>
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
                  "text-[10px] font-bold px-2 py-0.5 rounded-full select-none capitalize",
                  run.status === 'success' && "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400",
                  run.status === 'failed' && "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400",
                  run.status === 'running' && "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                )}>
                  {run.status}
                </span>
              </div>
              
              <p className="text-xs text-gray-655 dark:text-zinc-350 leading-relaxed">
                {run.summary}
              </p>
              
              <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 text-[10px] text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="size-3 text-zinc-400" />
                  <span>{new Date(run.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                </div>
                {run.duration && <span>{Math.round(run.duration / 100) / 10}s</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
