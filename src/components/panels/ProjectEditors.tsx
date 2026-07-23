'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useBotsStore, Chatbot } from '@/stores/useBotsStore';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowUp, Terminal, Trash2, Shield, Upload, ChevronLeft, Paperclip, FileText, FileAudio, FileVideo, FileImage, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const editIndexParam = searchParams?.get('editIndex');
  const editIndex = editIndexParam !== null && editIndexParam !== undefined ? parseInt(editIndexParam, 10) : -1;
  
  const allInstructions = bot.instructions ? bot.instructions.split('\n\n').filter(Boolean) : [];

  useEffect(() => {
    if (editIndex >= 0 && editIndex < allInstructions.length) {
      setInputValue(allInstructions[editIndex]);
    } else {
      setInputValue('');
    }
  }, [editIndex, bot.instructions]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSave = () => {
    if (!inputValue.trim()) return;
    let newList = [...allInstructions];
    if (editIndex >= 0 && editIndex < newList.length) {
      newList[editIndex] = inputValue;
      editBot(bot.id, { instructions: newList.join('\n\n') });
      toast.success('Instruction updated');
      router.push(`/spaces?bot=${bot.id}&view=instructions`);
    } else {
      newList = [inputValue, ...allInstructions];
      editBot(bot.id, { instructions: newList.join('\n\n') });
      toast.success('Instruction added');
    }
    setInputValue('');
  };

  return (
    <div className="relative flex w-full h-full flex-grow flex-col min-h-0 overflow-hidden pt-[32vh] items-center">
      <div className="relative overflow-y-auto min-h-0 bg-transparent transition-colors duration-300 flex flex-col flex-none">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 py-6 mx-auto w-full max-w-[796px]">
            <div className="h-0" />
          </div>
        </div>
      </div>

      <div className="shrink-0 w-full px-4 sm:px-6 lg:px-8 transition-all duration-300 py-3 bg-transparent border-t-0">
        <div className="mx-auto w-full max-w-[796px]">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white leading-tight">
              {editIndex >= 0 ? 'Edit Instruction' : 'Space Instructions'}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              {editIndex >= 0
                ? 'Update the selected guideline and press save to apply changes.'
                : 'Add specific guidelines, behaviors, or rules to customize how this space operates.'}
            </p>
          </div>

          <div className="flex flex-col w-full rounded-2xl border border-gray-200 bg-white px-3 shadow-sm sm:px-4">
            <div className="relative flex items-start gap-2 py-2">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
                    e.preventDefault();
                    handleSave();
                  }
                }}
                placeholder={editIndex >= 0 ? "Edit instruction..." : "Enter a new instruction here..."}
                className="min-h-[38px] w-full flex-1 resize-none border-none bg-transparent px-2 py-2 shadow-none outline-none placeholder:text-sm focus-visible:ring-0 text-gray-900 dark:text-white sm:px-3 animate-height"
                autoFocus
              />
              {editIndex >= 0 && (
                <button
                  type="button"
                  onClick={() => {
                    router.push(`/spaces?bot=${bot.id}&view=instructions`);
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 px-2 py-1 select-none font-medium cursor-pointer self-start mt-[5px]"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!inputValue.trim()}
                className="flex cursor-pointer items-center focus:outline-none disabled:cursor-default self-start mt-[5px]"
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
      </div>
    </div>
  );
}

export function GuardrailsEditor({ bot }: EditorProps) {
  const { editBot } = useBotsStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const editIndexParam = searchParams?.get('editIndex');
  const editIndex = editIndexParam !== null && editIndexParam !== undefined ? parseInt(editIndexParam, 10) : -1;
  
  const allGuardrails = bot.guardrails ? bot.guardrails.split('\n\n').filter(Boolean) : [];

  useEffect(() => {
    if (editIndex >= 0 && editIndex < allGuardrails.length) {
      setInputValue(allGuardrails[editIndex]);
    } else {
      setInputValue('');
    }
  }, [editIndex, bot.guardrails]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSave = () => {
    if (!inputValue.trim()) return;
    let newList = [...allGuardrails];
    if (editIndex >= 0 && editIndex < newList.length) {
      newList[editIndex] = inputValue;
      editBot(bot.id, { guardrails: newList.join('\n\n') });
      toast.success('Guardrail updated');
      router.push(`/spaces?bot=${bot.id}&view=guardrails`);
    } else {
      newList = [inputValue, ...allGuardrails];
      editBot(bot.id, { guardrails: newList.join('\n\n') });
      toast.success('Guardrail added');
    }
    setInputValue('');
  };

  return (
    <div className="relative flex w-full h-full flex-grow flex-col min-h-0 overflow-hidden pt-[32vh] items-center">
      <div className="relative overflow-y-auto min-h-0 bg-transparent transition-colors duration-300 flex flex-col flex-none">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 py-6 mx-auto w-full max-w-[796px]">
            <div className="h-0" />
          </div>
        </div>
      </div>

      <div className="shrink-0 w-full px-4 sm:px-6 lg:px-8 transition-all duration-300 py-3 bg-transparent border-t-0">
        <div className="mx-auto w-full max-w-[796px]">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white leading-tight">
              {editIndex >= 0 ? 'Edit Guardrail' : 'Space Guardrails'}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              {editIndex >= 0
                ? 'Update the selected guardrail and press save to apply changes.'
                : 'Define content constraints and safety boundaries for responses in this space.'}
            </p>
          </div>

          <div className="flex flex-col w-full rounded-2xl border border-gray-200 bg-white px-3 shadow-sm sm:px-4">
            <div className="relative flex items-start gap-2 py-2">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
                    e.preventDefault();
                    handleSave();
                  }
                }}
                placeholder={editIndex >= 0 ? "Edit guardrail..." : "Enter a new guardrail here..."}
                className="min-h-[38px] w-full flex-1 resize-none border-none bg-transparent px-2 py-2 shadow-none outline-none placeholder:text-sm focus-visible:ring-0 text-gray-900 dark:text-white sm:px-3 animate-height"
                autoFocus
              />
              {editIndex >= 0 && (
                <button
                  type="button"
                  onClick={() => {
                    router.push(`/spaces?bot=${bot.id}&view=guardrails`);
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 px-2 py-1 select-none font-medium cursor-pointer self-start mt-[5px]"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!inputValue.trim()}
                className="flex cursor-pointer items-center focus:outline-none disabled:cursor-default self-start mt-[5px]"
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
    <div className="relative flex w-full h-full flex-grow flex-col min-h-0 overflow-hidden pt-[32vh] items-center">
      <div className="relative overflow-y-auto min-h-0 bg-transparent transition-colors duration-300 flex flex-col flex-none">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 py-6 mx-auto w-full max-w-[796px]">
            <div className="h-0" />
          </div>
        </div>
      </div>

      <div className="shrink-0 w-full px-4 sm:px-6 lg:px-8 transition-all duration-300 py-3 bg-transparent border-t-0">
        <div className="mx-auto w-full max-w-[796px]">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white leading-tight">
              Space Knowledge
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
                  "min-h-8 w-full flex-1 border-none bg-transparent px-2 py-2 shadow-none outline-none text-sm cursor-pointer transition-colors flex items-center text-gray-400 hover:text-gray-600",
                  isDragActive ? "text-blue-500 bg-blue-50/50 rounded-lg" : "text-gray-450 dark:text-gray-300"
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
                {isDragActive ? "Drop files here..." : "Click or drag & drop files here to upload..."}
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
      </div>
    </div>
  );
}
