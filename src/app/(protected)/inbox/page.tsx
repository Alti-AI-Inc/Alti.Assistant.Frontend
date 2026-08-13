'use client';

import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function InboxPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [runs, setRuns] = useState<any[]>([]);

  // Fetch runs for Inbox
  useEffect(() => {
    const fetchRuns = () => {
      const savedRuns = localStorage.getItem('alti_task_runs');
      if (savedRuns) {
        try {
          setRuns(JSON.parse(savedRuns));
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
  }, []);

  const filteredRuns = runs.filter(run => 
    run.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    run.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#e1e1e1] dark:bg-zinc-950 p-6 space-y-4 overflow-hidden">
      {/* Floating Search Bar */}
      <div className="relative flex items-center h-12 w-full max-w-4xl mx-auto rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 px-4 shadow-sm focus-within:ring-2 focus-within:ring-black/5 transition-all flex-none">
        <Search className="size-4 text-gray-400 mr-2 flex-none" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-sm text-black dark:text-white outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Inbox List Area */}
      <div className="flex-1 overflow-y-auto space-y-3 min-h-0 max-w-4xl mx-auto w-full pb-8">
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
              </div>
              
              <p className="text-xs text-gray-655 dark:text-zinc-350 leading-relaxed">
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
  );
}
