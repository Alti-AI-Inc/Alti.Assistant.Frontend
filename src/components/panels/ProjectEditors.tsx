'use client';

import { useState } from 'react';
import { useBotsStore, Chatbot } from '@/stores/useBotsStore';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowUp, Terminal, Trash2, Shield, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface EditorProps {
  bot: Chatbot;
}

export function InstructionsEditor({ bot }: EditorProps) {
  const { editBot } = useBotsStore();
  const [inputValue, setInputValue] = useState('');
  
  const instructionsList = bot.instructions ? bot.instructions.split('\n\n').filter(Boolean) : [];

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    const newList = [inputValue, ...instructionsList];
    editBot(bot.id, { instructions: newList.join('\n\n') });
    setInputValue('');
  };

  const handleDelete = (index: number) => {
    const newList = instructionsList.filter((_, i) => i !== index);
    editBot(bot.id, { instructions: newList.join('\n\n') });
  };

  return (
    <div className="flex flex-col w-full h-full p-8 max-w-[796px] mx-auto pt-24 animate-in fade-in zoom-in-95 duration-200">
      <h1 className="mb-8 text-4xl font-medium text-gray-900 dark:text-white tracking-tight text-center">
        Edit Instructions
      </h1>

      <div className="flex flex-col rounded-2xl border border-gray-200 bg-white px-3 shadow-sm sm:px-4 mb-8">
        <div className="relative flex items-center gap-2 py-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="Enter a new instruction here..."
            className="min-h-8 w-full flex-1 resize-none border-none bg-transparent px-2 py-2 shadow-none outline-none placeholder:text-sm focus-visible:ring-0"
            autoFocus
            rows={1}
          />
          <button
            onClick={handleAdd}
            disabled={!inputValue.trim()}
            className="flex cursor-pointer items-center focus:outline-none disabled:cursor-default"
          >
            <ArrowUp className={cn(
              "size-7 flex-shrink-0 rounded-lg border-2 p-1.5 transition-colors",
              inputValue.trim()
                ? "border-gray-300 bg-black text-white hover:bg-gray-800"
                : "border-gray-200 bg-gray-100 text-gray-400"
            )} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 pb-4 custom-scrollbar space-y-3">
        {instructionsList.map((item, idx) => (
          <div
            key={idx}
            className="group flex items-center justify-between py-3 px-4 border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900/30 rounded-2xl shadow-xs transition-all duration-150 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10"
          >
            <div className="flex items-center gap-3 min-w-0 pr-3 flex-1">
              <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-955/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                <Terminal className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-relaxed break-words">
                  {item}
                </p>
                <span className="text-[9px] text-gray-400 font-medium block mt-0.5 uppercase font-mono tracking-wider">
                  Instruction Rule
                </span>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="h-7 w-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-none ml-2 flex items-center justify-center cursor-pointer"
                  title="Delete Instruction"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </DialogTrigger>
              <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[400px] sm:max-w-[400px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
                <div className="px-5 pt-5 pb-4 text-center">
                  <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
                    Delete Instruction
                  </h2>
                  <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1">
                    Are you sure you want to remove this instruction?
                  </p>
                </div>
                <div className="border-t border-black/10 dark:border-white/10 flex h-11">
                  <DialogClose asChild>
                    <button className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center border-r border-black/10 dark:border-white/10 outline-none">
                      Cancel
                    </button>
                  </DialogClose>
                  <DialogClose asChild>
                    <button 
                      onClick={() => handleDelete(idx)}
                      className="flex-1 text-[15px] font-medium text-red-500 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none"
                    >
                      Delete
                    </button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GuardrailsEditor({ bot }: EditorProps) {
  const { editBot } = useBotsStore();
  const [inputValue, setInputValue] = useState('');
  
  const guardrailsList = bot.guardrails ? bot.guardrails.split('\n\n').filter(Boolean) : [];

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    const newList = [inputValue, ...guardrailsList];
    editBot(bot.id, { guardrails: newList.join('\n\n') });
    setInputValue('');
  };

  const handleDelete = (index: number) => {
    const newList = guardrailsList.filter((_, i) => i !== index);
    editBot(bot.id, { guardrails: newList.join('\n\n') });
  };

  return (
    <div className="flex flex-col w-full h-full p-8 max-w-[796px] mx-auto pt-24 animate-in fade-in zoom-in-95 duration-200">
      <h1 className="mb-8 text-4xl font-medium text-gray-900 dark:text-white tracking-tight text-center">
        Edit Guardrails
      </h1>

      <div className="flex flex-col rounded-2xl border border-gray-200 bg-white px-3 shadow-sm sm:px-4 mb-8">
        <div className="relative flex items-center gap-2 py-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="Enter a new guardrail here..."
            className="min-h-8 w-full flex-1 resize-none border-none bg-transparent px-2 py-2 shadow-none outline-none placeholder:text-sm focus-visible:ring-0"
            autoFocus
            rows={1}
          />
          <button
            onClick={handleAdd}
            disabled={!inputValue.trim()}
            className="flex cursor-pointer items-center focus:outline-none disabled:cursor-default"
          >
            <ArrowUp className={cn(
              "size-7 flex-shrink-0 rounded-lg border-2 p-1.5 transition-colors",
              inputValue.trim()
                ? "border-gray-300 bg-black text-white hover:bg-gray-800"
                : "border-gray-200 bg-gray-100 text-gray-400"
            )} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 pb-4 custom-scrollbar space-y-3">
        {guardrailsList.map((item, idx) => (
          <div
            key={idx}
            className="group flex items-center justify-between py-3 px-4 border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900/30 rounded-2xl shadow-xs transition-all duration-150 hover:bg-red-50/20 dark:hover:bg-red-950/10"
          >
            <div className="flex items-center gap-3 min-w-0 pr-3 flex-1">
              <div className="h-7 w-7 rounded-lg bg-red-50 dark:bg-red-955/40 text-red-650 dark:text-red-400 flex items-center justify-center flex-shrink-0">
                <Shield className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-relaxed break-words">
                  {item}
                </p>
                <span className="text-[9px] text-gray-400 font-medium block mt-0.5 uppercase font-mono tracking-wider">
                  Constraint Rule
                </span>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="h-7 w-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-none ml-2 flex items-center justify-center cursor-pointer"
                  title="Delete Guardrail"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </DialogTrigger>
              <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[400px] sm:max-w-[400px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
                <div className="px-5 pt-5 pb-4 text-center">
                  <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
                    Delete Guardrail
                  </h2>
                  <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1">
                    Are you sure you want to remove this constraint?
                  </p>
                </div>
                <div className="border-t border-black/10 dark:border-white/10 flex h-11">
                  <DialogClose asChild>
                    <button className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center border-r border-black/10 dark:border-white/10 outline-none">
                      Cancel
                    </button>
                  </DialogClose>
                  <DialogClose asChild>
                    <button 
                      onClick={() => handleDelete(idx)}
                      className="flex-1 text-[15px] font-medium text-red-500 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none"
                    >
                      Delete
                    </button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DataEditor({ bot }: EditorProps) {
  const { editBot } = useBotsStore();

  return (
    <div className="flex flex-col w-full h-full p-8 max-w-[796px] mx-auto pt-24 animate-in fade-in zoom-in-95 duration-200">
      <h1 className="mb-8 text-4xl font-medium text-gray-900 dark:text-white tracking-tight text-center">
        Project Data
      </h1>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <Upload className="size-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Knowledge Base</h2>
        {bot.data ? (
          <>
            <p className="text-sm text-gray-500 max-w-sm mb-6">
              Your project is connected to a Knowledge Base backend. Modifying files here is currently restricted.
            </p>
            <Button variant="destructive" onClick={() => editBot(bot.id, { data: undefined })}>
              Disconnect Knowledge Base
            </Button>
          </>
        ) : (
          <p className="text-sm text-gray-500 max-w-sm">
            This project has no active data connections.
          </p>
        )}
      </div>
    </div>
  );
}
