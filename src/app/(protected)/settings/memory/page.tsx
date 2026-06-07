'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Brain } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function MemoryPage() {
  const [selected, setSelected] = useState('1-month');

  useEffect(() => {
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
    { value: 'off', label: 'Off' },
    { value: '1-month', label: '1 Month' },
    { value: '3-month', label: '3 Months' },
    { value: '6-month', label: '6 Months' },
    { value: '12-month', label: '12 Months' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F5F5F7] dark:bg-gray-955">
      {/* Top Navbar */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-950">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          Chat Memory
        </h1>
      </div>

      {/* Page Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6">
        <div className="max-w-3xl space-y-6">
          {/* Information Card */}
          <div className="bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Retention Configuration
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Control how long your chat history is retained. Once the retention period ends, older conversation logs are automatically pruned to keep your workspace clean and protect context limits.
              </p>
            </div>

            <div className="h-px bg-black/5 dark:bg-white/5" />

            <div className="flex items-center justify-between gap-4 pt-1">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 block">
                  History Limit
                </span>
                <span className="text-[11px] text-gray-400 block">
                  Select a duration after which chat history is deleted.
                </span>
              </div>

              {/* Styled Select Dropdown (Popup) */}
              <Select value={selected} onValueChange={handleSelect}>
                <SelectTrigger className="w-[180px] h-10 rounded-xl bg-[#F5F5F7] dark:bg-zinc-800 border-black/10 dark:border-white/10 text-xs font-semibold focus:ring-1 focus:ring-indigo-500 focus:outline-none">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900">
                  {options.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-xs font-semibold rounded-lg focus:bg-indigo-50 dark:focus:bg-indigo-950/40 focus:text-indigo-600 dark:focus:text-indigo-400 cursor-pointer"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
