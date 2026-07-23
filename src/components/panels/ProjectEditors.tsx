'use client';

import { useState, useRef } from 'react';
import { useBotsStore, Chatbot } from '@/stores/useBotsStore';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowUp, Terminal, Trash2, Shield, Upload, ChevronLeft, Paperclip, FileText, FileAudio, FileVideo, FileImage, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export function getFileExtension(filename: string) {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

export function getFileIconComponent(filename: string) {
  const ext = getFileExtension(filename).toLowerCase();
  if (['mp3', 'wav', 'm4a', 'aac', 'ogg'].includes(ext)) return FileAudio;
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return FileVideo;
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) return FileImage;
  return FileText;
}

interface EditorProps {
  bot: Chatbot;
}

export function InstructionsEditor({ bot }: EditorProps) {
  const { editBot } = useBotsStore();
  const [inputValue, setInputValue] = useState('');
  
  const allInstructions = bot.instructions ? bot.instructions.split('\n\n').filter(Boolean) : [];

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    const newList = [inputValue, ...allInstructions];
    editBot(bot.id, { instructions: newList.join('\n\n') });
    setInputValue('');
  };

  return (
    <div className="flex flex-col w-full p-8 max-w-[796px] mx-auto pt-[32vh] animate-in fade-in zoom-in-95 duration-200">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white leading-tight">
          Space Instructions
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          Add specific guidelines, behaviors, or rules to customize how this space operates.
        </p>
      </div>

      <div className="flex flex-col w-full rounded-2xl border border-gray-200 bg-white px-3 shadow-sm sm:px-4">
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
    </div>
  );
}

export function GuardrailsEditor({ bot }: EditorProps) {
  const { editBot } = useBotsStore();
  const [inputValue, setInputValue] = useState('');
  
  const allGuardrails = bot.guardrails ? bot.guardrails.split('\n\n').filter(Boolean) : [];

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    const newList = [inputValue, ...allGuardrails];
    editBot(bot.id, { guardrails: newList.join('\n\n') });
    setInputValue('');
  };

  return (
    <div className="flex flex-col w-full p-8 max-w-[796px] mx-auto pt-[32vh] animate-in fade-in zoom-in-95 duration-200">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white leading-tight">
          Space Guardrails
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          Define content constraints and safety boundaries for responses in this space.
        </p>
      </div>

      <div className="flex flex-col w-full rounded-2xl border border-gray-200 bg-white px-3 shadow-sm sm:px-4">
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
    </div>
  );
}

export function DataEditor({ bot }: EditorProps) {
  const { editBot } = useBotsStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  let allFiles: { name: string; size: number }[] = [];
  try {
    allFiles = bot.data ? JSON.parse(bot.data) : [];
  } catch (e) {
    allFiles = bot.data ? [{ name: bot.data, size: 0 }] : [];
  }

  const addFiles = (newFiles: File[]) => {
    const newItems = newFiles.map(f => ({ name: f.name, size: f.size }));
    const merged = [...allFiles, ...newItems];
    editBot(bot.id, { data: JSON.stringify(merged) });
  };

  return (
    <div className="flex flex-col w-full p-8 max-w-[796px] mx-auto pt-[32vh] animate-in fade-in zoom-in-95 duration-200">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white leading-tight">
          Space Knowledgebase
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          Upload documents or data files to provide source context for this space.
        </p>
      </div>

      <div className="flex flex-col w-full rounded-2xl border border-gray-200 bg-white px-3 shadow-sm sm:px-4">
        <div className="relative flex items-center gap-2 py-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer items-center focus:outline-none"
            aria-label="Upload"
          >
            <Paperclip className="size-7 flex-shrink-0 rounded-lg border-2 border-gray-300 bg-black p-1.5 text-white transition-colors hover:bg-gray-800" />
          </button>
 
          <div 
            className={cn(
              "min-h-8 w-full flex-1 border-none bg-transparent px-2 py-2 shadow-none outline-none text-sm cursor-pointer transition-colors flex items-center",
              isDragActive ? "text-blue-500 bg-blue-50/50 rounded-lg" : "text-gray-400 hover:text-gray-600"
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragActive(true);
            }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragActive(false);
              if (e.dataTransfer.files) {
                const filesArray = Array.from(e.dataTransfer.files);
                addFiles(filesArray);
              }
            }}
          >
            {isDragActive ? "Drop files here..." : "Click or drag & drop files here..."}
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            multiple
            onChange={(e) => {
              if (e.target.files) {
                const filesArray = Array.from(e.target.files);
                addFiles(filesArray);
              }
            }}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
