'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  Search,
  Trash2,
  ArrowUp,
} from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { toast } from 'sonner';

const GuardrailsContent = () => {
  const [guardrailsList, setGuardrailsList] = useState<{ id: string; text: string; timestamp: string }[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const storedGuard = localStorage.getItem('alti_guardrails');
    if (storedGuard) {
      setGuardrailsList(JSON.parse(storedGuard));
    } else {
      const defaults = [
        {
          id: 'guard-1',
          text: 'Do not mention specific pricing details of competitor platforms.',
          timestamp: '05/26/2026, 12:00 PM'
        },
        {
          id: 'guard-2',
          text: 'Under no circumstances should you reference internal database keys or source code URLs.',
          timestamp: '05/26/2026, 12:05 PM'
        },
        {
          id: 'guard-3',
          text: 'Do not output HTML blocks unless specifically asked by the user.',
          timestamp: '05/26/2026, 12:10 PM'
        }
      ];
      setGuardrailsList(defaults);
      localStorage.setItem('alti_guardrails', JSON.stringify(defaults));
    }
  }, []);

  const handleAddGuardrail = () => {
    if (!inputVal.trim()) {
      toast.error('Please enter a safety rule.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const newItem = {
        id: `guard-${Date.now()}`,
        text: inputVal.trim(),
        timestamp: new Date().toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      };

      const updatedList = [newItem, ...guardrailsList];
      setGuardrailsList(updatedList);
      localStorage.setItem('alti_guardrails', JSON.stringify(updatedList));
      setInputVal('');
      setIsSaving(false);
    }, 300);
  };

  const handleDeleteGuardrail = (id: string) => {
    const updatedList = guardrailsList.filter(item => item.id !== id);
    setGuardrailsList(updatedList);
    localStorage.setItem('alti_guardrails', JSON.stringify(updatedList));
  };

  const filteredGuardrails = guardrailsList.filter(item =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isMounted) {
    return <div className="text-sm text-gray-555 p-8">Loading platform guardrails...</div>;
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F5F5F7] dark:bg-gray-955">
      {/* Top Navbar / Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center px-8 flex-none bg-white dark:bg-gray-955 justify-between">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Platform Guardrails
        </h1>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6 flex justify-center">
        <div className="w-full space-y-6">
          {/* Top Add Guardrail Box (Matching Platform Knowledge Upload style) */}
          <div className="relative w-full flex-none flex items-center gap-2 bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 rounded-lg shadow-sm pr-2 pl-4 py-1.5 transition-colors">
            <input
              placeholder="Enter guardrail here..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  handleAddGuardrail();
                }
              }}
              disabled={isSaving}
              className="flex-1 min-w-0 bg-transparent border-none py-1.5 h-9 text-base text-gray-800 placeholder-gray-400 dark:text-gray-100 outline-none focus:ring-0 focus-visible:ring-0"
            />
            <div className="flex-none ml-2 flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleAddGuardrail}
                disabled={isSaving || !inputVal.trim()}
                className="h-8 px-4 rounded-md cursor-pointer"
              >
                Add
                <ArrowUp className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Search Bar (Matching Platform Knowledge search bar style) */}
          <div className="relative w-full flex-none">
            <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
            <Input
              placeholder="Search guardrails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12 w-full text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none outline-none"
            />
          </div>

          {/* Dynamic Results Grid (Floating Individual Cards, Matching Platform Knowledge style) */}
          <div className="w-full">
            {filteredGuardrails.length === 0 ? (
              <div className="w-full border border-black/10 dark:border-white/10 rounded-lg bg-white/40 dark:bg-gray-900/10 py-8 px-4 text-center text-xs text-gray-400 flex flex-col items-center justify-center gap-2">
                <Search className="h-6 w-6 text-gray-300 dark:text-gray-700" />
                <span>No matching safety rules found</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pb-4">
                {filteredGuardrails.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-white/90 dark:bg-gray-900/90 border border-black/5 dark:border-white/5 rounded-lg shadow-sm items-center animate-in fade-in-50 duration-150"
                  >
                    {/* Left Icon & Content */}
                    <div className="col-span-10 flex items-center gap-5 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-955/40 text-rose-650 dark:text-rose-455 flex items-center justify-center flex-none">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-normal break-words">
                          {item.text}
                        </span>
                        <span className="text-[9px] text-gray-400 font-medium block mt-0.5 uppercase font-mono tracking-wider">
                          Safety Rule • {item.timestamp}
                        </span>
                      </div>
                    </div>

                    {/* Delete Action */}
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 cursor-pointer"
                        onClick={() => setDeleteTargetId(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* iOS-Style Delete Confirmation Dialog */}
      <Dialog open={deleteTargetId !== null} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[400px] sm:max-w-[400px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden animate-in fade-in-50 duration-150">
          {/* Centered Content Section */}
          <div className="px-5 pt-5 pb-4 text-center">
            <DialogTitle className="text-[17px] font-semibold text-black dark:text-white leading-tight text-center">
              Delete Guardrail
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1 text-center">
              Are you sure you want to remove this guardrail?
            </DialogDescription>
          </div>

          {/* Extended Border & iOS Layout Action Buttons */}
          <div className="border-t border-black/10 dark:border-white/10 flex h-11">
            {/* Cancel Option */}
            <DialogClose asChild>
              <button
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center border-r border-black/10 dark:border-white/10 outline-none cursor-pointer"
              >
                Cancel
              </button>
            </DialogClose>
            
            {/* Confirm Option */}
            <DialogClose asChild>
              <button
                onClick={() => {
                  if (deleteTargetId) {
                    handleDeleteGuardrail(deleteTargetId);
                    setDeleteTargetId(null);
                  }
                }}
                className="flex-1 text-[15px] font-medium text-red-500 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none cursor-pointer"
              >
                Delete
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default function GuardrailsPage() {
  return (
    <Suspense fallback={<div className="flex-1 h-full flex items-center justify-center text-sm text-gray-555">Loading platform guardrails...</div>}>
      <GuardrailsContent />
    </Suspense>
  );
}
