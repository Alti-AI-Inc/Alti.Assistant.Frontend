'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Trash2, Shield, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

const STORAGE_KEY = 'aphura_custom_guardrails_array';

interface Guardrail {
  id: string;
  text: string;
  createdAt: number;
}

export default function GuardrailsPage() {
  const [guardrails, setGuardrails] = useState<Guardrail[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newGuardrail, setNewGuardrail] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setGuardrails(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse guardrails', e);
        }
      }
    }
  }, []);

  const saveGuardrails = (newGuardrails: Guardrail[]) => {
    setGuardrails(newGuardrails);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newGuardrails));
  };

  const handleAdd = () => {
    if (!newGuardrail.trim()) return;
    const item: Guardrail = {
      id: Date.now().toString(),
      text: newGuardrail.trim(),
      createdAt: Date.now(),
    };
    saveGuardrails([item, ...guardrails]);
    setNewGuardrail('');
    toast.success('Guardrail added');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
    }
  };

  const handleDelete = (id: string) => {
    saveGuardrails(guardrails.filter(g => g.id !== id));
    toast.success('Guardrail removed');
  };

  const filteredGuardrails = guardrails.filter(g => 
    g.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full w-full flex-col bg-[#e1e1e1] dark:bg-zinc-950 overflow-hidden">
      <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-black/10 px-8 dark:border-white/10 bg-white dark:bg-zinc-950">
        <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Guardrails
        </h1>
      </header>

      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8 flex flex-col overflow-y-auto">
        
        {/* Main Prompt Box Container */}
        <div className="relative flex w-full flex-col gap-2 bg-white dark:bg-zinc-900 rounded-3xl p-3 shadow-[0_2px_15px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.2)] border border-black/5 dark:border-white/10 z-10">
          <Textarea
            ref={textareaRef}
            value={newGuardrail}
            onChange={(e) => {
              setNewGuardrail(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="Define a strict boundary or rule Aphura must not cross..."
            className="w-full resize-none border-none bg-transparent px-4 py-3 text-[15px] focus-visible:ring-0 text-zinc-900 placeholder:text-zinc-500 dark:text-zinc-100 dark:placeholder:text-zinc-500 max-h-[40dvh] min-h-[44px]"
            style={{ overflowY: 'auto' }}
          />
          <div className="flex items-center justify-between px-2 pt-2 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center text-[11px] text-zinc-400 font-medium">
              <Shield className="mr-1.5 h-3.5 w-3.5" />
              Press Enter to add guardrail
            </div>
            <button
              onClick={handleAdd}
              disabled={!newGuardrail.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0000ff] text-white transition-all hover:bg-[#0000ff]/90 disabled:opacity-50 disabled:bg-[#0000ff]/50 disabled:cursor-not-allowed shadow-sm"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mt-8 mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guardrails..."
            className="w-full h-11 rounded-full bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 pl-11 pr-4 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#0000ff]/50 focus:ring-1 focus:ring-[#0000ff]/50 transition-all shadow-sm"
          />
        </div>

        {/* Guardrails List (Floating Style) */}
        <div className="flex flex-col gap-4 pb-24">
          {filteredGuardrails.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-12 w-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-zinc-400" />
              </div>
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">No guardrails found</h3>
              <p className="text-xs text-zinc-500">
                {searchQuery ? "Try adjusting your search terms" : "Add your first guardrail rule above"}
              </p>
            </div>
          ) : (
            filteredGuardrails.map((inst) => (
              <div
                key={inst.id}
                className="group relative flex flex-col gap-3 rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-sm border border-black/5 dark:border-white/10 transition-all hover:shadow-md hover:border-black/10 dark:hover:border-white/20"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[14px] leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap break-words flex-1">
                    {inst.text}
                  </p>
                  <button
                    onClick={() => handleDelete(inst.id)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                    title="Delete guardrail"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                  Enforced Since {new Date(inst.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
