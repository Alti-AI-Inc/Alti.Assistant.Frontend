'use client';

import { useState, useEffect, Suspense } from 'react';
import { toast } from 'sonner';
import { Brain, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const MemoryContent = () => {
  const [selected, setSelected] = useState('1-month');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem('alti_memory_retention');
    if (stored) {
      setSelected(stored);
    }
  }, []);

  const handleSelect = (val: string) => {
    setSelected(val);
    localStorage.setItem('alti_memory_retention', val);
    const label = options.find(o => o.value === val)?.label || val;
    toast.success(`Memory retention updated to ${label}`);
  };

  const options = [
    { value: 'off', label: 'Off', desc: 'No conversation history will be retained.' },
    { value: '1-month', label: '1 Month', desc: 'Prune conversations older than 30 days.' },
    { value: '3-month', label: '3 Months', desc: 'Prune conversations older than 90 days.' },
    { value: '6-month', label: '6 Months', desc: 'Prune conversations older than 180 days.' },
    { value: '12-month', label: '12 Months', desc: 'Prune conversations older than 365 days.' },
  ];

  if (!isMounted) {
    return <div className="text-sm text-gray-555 p-8">Loading platform memory settings...</div>;
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F5F5F7] dark:bg-gray-955">
      {/* Top Navbar / Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-955 justify-between">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Platform Memory
        </h1>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6 flex justify-center">
        <div className="w-full space-y-6">
          {/* Header description (no box) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-gray-950 dark:text-white" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Long Term Memory Retention</h2>
            </div>
            <p className="text-xs text-gray-505 dark:text-gray-400 leading-relaxed">
              Control how long your chat history is retained. Once the retention period ends, older conversation logs are automatically pruned to keep your workspace clean and protect context limits.
            </p>
          </div>

          {/* Toggle/Selection List */}
          <div className="space-y-3">
            {options.map((opt) => {
              const isSelected = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    'w-full flex items-center justify-between p-4 border rounded-2xl text-left transition-all duration-150 cursor-pointer shadow-xs',
                    isSelected
                      ? 'bg-white border-black dark:bg-zinc-900 dark:border-white'
                      : 'bg-white/80 border-black/10 hover:bg-white dark:bg-zinc-900/60 dark:border-white/5 dark:hover:bg-zinc-900'
                  )}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white block">
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-gray-450 dark:text-gray-400 block">
                      {opt.desc}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="h-5 w-5 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PlatformMemoryPage() {
  return (
    <Suspense fallback={<div className="flex-1 h-full flex items-center justify-center text-sm text-gray-555">Loading platform memory settings...</div>}>
      <MemoryContent />
    </Suspense>
  );
}
