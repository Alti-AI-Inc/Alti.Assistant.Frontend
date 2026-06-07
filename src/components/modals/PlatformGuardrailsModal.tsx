'use client';

import { useState, useEffect } from 'react';
import { useModalStore } from '@/stores/useModalStore';
import { toast } from 'sonner';
import { Search, AlertCircle, Trash2, ArrowUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AudioRecorder from '@/components/AudioRecorder';
import { cn } from '@/lib/utils';

export const PlatformGuardrailsModal = () => {
  const { isOpen, onClose } = useModalStore();
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
      toast.success('Guardrail added successfully');
    }, 300);
  };

  const handleDeleteGuardrail = (id: string) => {
    const updatedList = guardrailsList.filter(item => item.id !== id);
    setGuardrailsList(updatedList);
    localStorage.setItem('alti_guardrails', JSON.stringify(updatedList));
    toast.success('Guardrail removed');
  };

  const filteredGuardrails = guardrailsList.filter(item =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isMounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[680px] rounded-2xl p-6 bg-white dark:bg-zinc-900 border-none shadow-xl flex flex-col max-h-[85vh] overflow-hidden">
        <DialogHeader className="pb-4 border-b border-black/5 dark:border-white/5 space-y-0 flex-none">
          <DialogTitle className="text-base font-semibold text-gray-900 dark:text-white text-left">
            Platform Guardrails
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-5 overflow-y-auto flex-1 min-h-0 pr-1">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Configure safety rules, content constraints, and response policies to enforce safety and brand boundaries during conversations.
          </p>

          {/* Add Guardrail Prompter */}
          <div className="flex items-center rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900/30 px-3.5 py-1.5 shadow-xs transition-all focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500">
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
              className="flex-1 min-w-0 bg-transparent border-none py-1.5 text-sm text-gray-800 placeholder-gray-400 dark:text-gray-100 outline-none focus:ring-0 focus-visible:ring-0"
            />
            <div className="flex-none ml-2">
              {inputVal.trim() && !isAudioRecording ? (
                <ArrowUp
                  onClick={handleAddGuardrail}
                  className={cn(
                    'size-7 flex-shrink-0 rounded-lg border-2 border-gray-300 bg-black p-1 text-white transition-opacity hover:bg-zinc-800 cursor-pointer dark:bg-white dark:text-black dark:border-gray-700 dark:hover:bg-zinc-200',
                    isSaving ? 'cursor-not-allowed opacity-50' : ''
                  )}
                />
              ) : (
                <AudioRecorder setMessage={setInputVal} setIsRecording={setIsAudioRecording} />
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search guardrails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-9 text-sm rounded-xl bg-white border-gray-200 dark:border-gray-800 dark:bg-gray-900/30 text-gray-800 dark:text-gray-100 placeholder-gray-400 placeholder:text-gray-400 dark:placeholder-gray-400 focus-visible:ring-1 focus-visible:ring-rose-500/30 focus-visible:border-rose-500"
            />
          </div>

          {/* Dynamic List */}
          {filteredGuardrails.length === 0 ? (
            <div className="w-full border border-black/10 dark:border-white/10 rounded-2xl bg-white/40 dark:bg-gray-900/10 py-8 px-4 text-center text-xs text-gray-400 flex flex-col items-center justify-center gap-2">
              <Search className="h-6 w-6 text-gray-300 dark:text-gray-700" />
              <span>No matching safety rules found</span>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {filteredGuardrails.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between py-3 px-4 border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900/30 rounded-2xl shadow-xs transition-all duration-150 hover:bg-rose-50/20 dark:hover:bg-rose-955/10"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3 flex-1">
                    <div className="h-7 w-7 rounded-lg bg-rose-50 dark:bg-rose-955/40 text-rose-650 dark:text-rose-450 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate leading-relaxed" title={item.text}>
                        {item.text}
                      </p>
                      <span className="text-[9px] text-gray-400 font-medium block mt-0.5 uppercase font-mono tracking-wider">
                        Safety Rule • {item.timestamp}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTargetId(item.id)}
                    className="h-7 w-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-none ml-2"
                    title="Delete Safety Rule"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteTargetId !== null} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[380px] sm:max-w-[380px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden z-[9999]">
          <div className="px-5 pt-5 pb-4 text-center">
            <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
              Delete Guardrail
            </h2>
            <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1">
              Are you sure you want to remove this guardrail?
            </p>
          </div>

          <div className="border-t border-black/10 dark:border-white/10 flex h-11">
            <button
              onClick={() => setDeleteTargetId(null)}
              className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center border-r border-black/10 dark:border-white/10 outline-none"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (deleteTargetId) {
                  handleDeleteGuardrail(deleteTargetId);
                  setDeleteTargetId(null);
                }
              }}
              className="flex-1 text-[15px] font-medium text-red-500 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default PlatformGuardrailsModal;
