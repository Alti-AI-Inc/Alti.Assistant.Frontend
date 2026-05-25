'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useModalStore } from '@/stores/useModalStore';
import { useBotsStore } from '@/stores/useBotsStore';
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Database, ShieldAlert, Cpu, Sparkles, MessageSquare } from 'lucide-react';

export function AddModelModal() {
  const { isOpen, onClose, type } = useModalStore();
  const { addBot, setActiveBotId } = useBotsStore();
  const { data: session } = useSession();
  const { data: knowledgeBases, isLoading: isLoadingKBs } = useKnowledgeBases(session?.accessToken);
  const router = useRouter();

  const [name, setName] = useState('');
  const [dataSelection, setDataSelection] = useState('');
  const [instructions, setInstructions] = useState('');
  const [guardrails, setGuardrails] = useState('');
  const [error, setError] = useState('');

  if (type !== 'add-model') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a Model Name.');
      return;
    }
    if (!instructions.trim()) {
      setError('Please provide Instructions for the model.');
      return;
    }

    // Map selection to name or fallback
    const selectedKB = knowledgeBases?.find((kb) => kb.id === dataSelection);
    const dataName = selectedKB ? selectedKB.name : (dataSelection || 'No specific data source selected');

    // Create the bot using useBotsStore
    const newBot = addBot({
      name,
      description: `Custom model trained on ${dataName}`,
      instructions,
      model: 'Gemini 1.5 Pro',
      avatar: '🧠',
      data: dataSelection, // Store the selected knowledge base ID
      guardrails: guardrails, // Store the guardrails
    } as any);

    setActiveBotId(newBot.id);
    router.push(`/models?bot=${newBot.id}`);
    onClose();

    // Reset state
    setName('');
    setDataSelection('');
    setInstructions('');
    setGuardrails('');
    setError('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[540px] border border-white/20 bg-white/80 backdrop-blur-xl dark:bg-gray-950/80 p-6 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
        {/* Glow Effects */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
              <Cpu className="h-6 w-6 text-blue-600 animate-pulse" />
              Create Custom Model
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
              Configure a dedicated sandboxed model with custom instructions, safety guardrails, and context-specific data.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-900/50 rounded-xl p-3 text-xs text-red-600 dark:text-red-400 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Box 1: Model Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                Model Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Alti Financial Analyst, Legal Copilot"
                className="rounded-xl border-gray-200/80 bg-white/50 backdrop-blur-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-900/50 dark:border-gray-800 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm py-5"
              />
            </div>

            {/* Box 2: Data Source */}
            <div className="space-y-1.5">
              <Label
                htmlFor="data"
                className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
              >
                <Database className="h-3.5 w-3.5 text-indigo-500" />
                Data (Knowledge Base)
              </Label>
              <select
                id="data"
                value={dataSelection}
                onChange={(e) => setDataSelection(e.target.value)}
                className="w-full rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-xs p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-900/50 dark:border-gray-800 dark:text-gray-200 cursor-pointer"
              >
                <option value="">No specific data source (Sandbox General Model)</option>
                {isLoadingKBs ? (
                  <option disabled>Loading workspaces/knowledge bases...</option>
                ) : (
                  knowledgeBases?.map((kb) => (
                    <option key={kb.id} value={kb.id}>
                      {kb.name} ({kb.documentsCount} documents)
                    </option>
                  ))
                )}
              </select>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-normal">
                Select a pre-configured workspace to connect private files, PDFs, and scraped pages directly to this model.
              </p>
            </div>

            {/* Box 3: Instructions */}
            <div className="space-y-1.5">
              <Label
                htmlFor="instructions"
                className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
              >
                <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                Instructions (System Prompt)
              </Label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => {
                  setInstructions(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Act as a financial auditing expert. Always outline key findings in bullet points and format currency values as USD..."
                className="min-h-[90px] rounded-xl border-gray-200/80 bg-white/50 backdrop-blur-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-900/50 dark:border-gray-800 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs leading-relaxed"
              />
              <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-normal">
                Define your AI's custom persona, behavioral guidelines, professional expertise, and response styles.
              </p>
            </div>

            {/* Box 4: Guardrails */}
            <div className="space-y-1.5">
              <Label
                htmlFor="guardrails"
                className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
              >
                <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
                Guardrails
              </Label>
              <Textarea
                id="guardrails"
                value={guardrails}
                onChange={(e) => setGuardrails(e.target.value)}
                placeholder="e.g. Do not answer questions unrelated to banking laws. Never mention competitor prices. Decline queries requesting Python code..."
                className="min-h-[90px] rounded-xl border-gray-200/80 bg-white/50 backdrop-blur-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-900/50 dark:border-gray-800 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs leading-relaxed"
              />
              <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-normal">
                Specify constraints and strict rules. The model will refuse requests that violate these parameters.
              </p>
            </div>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl px-5 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-6 text-xs font-semibold shadow-md shadow-blue-500/10 active:scale-95 transition-transform"
            >
              Create Model
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
