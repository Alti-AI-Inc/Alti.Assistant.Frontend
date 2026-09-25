'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, FileText, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';


const STORAGE_KEY = 'aphura_custom_instructions_array';
const LEGACY_KEY = 'aphura_custom_instructions';

interface Instruction {
  id: string;
  text: string;
  createdAt: number;
}

export default function InstructionsPage() {
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newInstruction, setNewInstruction] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setInstructions(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse instructions', e);
        }
      } else {
        // Migrate legacy instructions if they exist
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy && legacy.trim()) {
          const migrated: Instruction[] = [{
            id: Date.now().toString(),
            text: legacy,
            createdAt: Date.now()
          }];
          setInstructions(migrated);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        }
      }
    }
  }, []);

  const saveInstructions = (newInstructions: Instruction[]) => {
    setInstructions(newInstructions);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newInstructions));
  };

  const handleAdd = () => {
    if (!newInstruction.trim()) return;
    const item: Instruction = {
      id: Date.now().toString(),
      text: newInstruction.trim(),
      createdAt: Date.now(),
    };
    saveInstructions([item, ...instructions]);
    setNewInstruction('');
    toast.success('Instruction added');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
    }
  };

  const handleDelete = (id: string) => {
    saveInstructions(instructions.filter(i => i.id !== id));
    toast.success('Instruction removed');
  };

  const filteredInstructions = instructions.filter(i => 
    i.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full w-full flex-col bg-[#e1e1e1] dark:bg-zinc-950 overflow-hidden">
      <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-black/10 px-8 dark:border-white/10 bg-white dark:bg-zinc-950">
        <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Instructions
        </h1>
      </header>

      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8 flex flex-col overflow-y-auto">
        
        {/* Main Prompt Box Container */}
        <div
          className="relative flex min-h-[52px] w-full items-center gap-1.5 rounded-[5px] border border-zinc-300 bg-white px-3 py-1.5 shadow-xs transition-all duration-300 dark:border-zinc-700/80 dark:bg-zinc-800 z-10"
        >
          <textarea
            ref={textareaRef}
            value={newInstruction}
            onChange={(e) => {
              setNewInstruction(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="Enter prompt here..."
            className="w-full resize-none border-none bg-transparent px-2 py-2 text-[15px] focus-visible:ring-0 outline-none text-zinc-900 placeholder:text-zinc-500 dark:text-zinc-100 dark:placeholder:text-zinc-500 min-h-0"
            style={{ overflowY: 'auto', maxHeight: '40dvh' }}
          />

          <button
            onClick={handleAdd}
            disabled={!newInstruction.trim()}
            className="flex size-10 sm:size-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-[3px] border border-[#0000ff] bg-[#0000ff] text-white transition-all hover:bg-[#0000ff]/90 focus:outline-none active:scale-95 disabled:cursor-not-allowed"
            aria-label="Add"
          >
            <ArrowRight strokeWidth={2} className="size-3.5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mt-8 mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search instructions..."
            className="w-full min-h-[52px] rounded-[5px] bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700/80 pl-11 pr-4 text-[15px] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] transition-all shadow-xs"
          />
        </div>

        {/* Instructions List (Floating Style) */}
        <div className="flex flex-col gap-4 pb-24">
          {filteredInstructions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-12 w-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-zinc-400" />
              </div>
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">No instructions found</h3>
              <p className="text-xs text-zinc-500">
                {searchQuery ? "Try adjusting your search terms" : "Add your first custom instruction above"}
              </p>
            </div>
          ) : (
            filteredInstructions.map((inst) => (
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
                    title="Delete instruction"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                  Added {new Date(inst.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
