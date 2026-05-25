'use client';

import { useEffect, Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import FullConversation from '@/app/(protected)/c/[id]/_components/FullConversation';
import LeftSideNav from '@/components/LeftSideNav';
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { cn } from '@/lib/utils';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useBotsStore } from '@/stores/useBotsStore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Database, ShieldAlert, Cpu, Sparkles, MessageSquare } from 'lucide-react';

function ModelsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  
  const { setActiveConversation } = useConversationsStore();
  const { isRightSidebarOpen } = useSidebarStore();
  const { bots, activeBotId, setActiveBotId, addBot } = useBotsStore();
  const { data: knowledgeBases, isLoading: isLoadingKBs } = useKnowledgeBases(session?.accessToken);

  // Sync bot selection state with query param
  const botParam = searchParams?.get('bot');

  useEffect(() => {
    setActiveConversation(null);
    if (botParam) {
      setActiveBotId(botParam);
    } else {
      setActiveBotId(null);
    }
  }, [botParam, setActiveBotId, setActiveConversation]);

  // Form State for creating a new model
  const [name, setName] = useState('');
  const [dataSelection, setDataSelection] = useState('');
  const [instructions, setInstructions] = useState('');
  const [guardrails, setGuardrails] = useState('');
  const [error, setError] = useState('');

  const activeBot = bots.find((b) => b.id === botParam);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a Model Name.');
      return;
    }
    if (!instructions.trim()) {
      setError('Please provide Instructions for the model.');
      return;
    }

    const selectedKB = knowledgeBases?.find((kb) => kb.id === dataSelection);
    const dataName = selectedKB ? selectedKB.name : (dataSelection || 'No specific data source selected');

    // Create the bot
    const newBot = addBot({
      name,
      description: `Custom model trained on ${dataName}`,
      instructions,
      model: 'Gemini 1.5 Pro',
      avatar: '🧠',
      data: dataSelection,
      guardrails: guardrails,
    } as any);

    // Set active select and navigate
    setActiveBotId(newBot.id);
    router.push(`/models?bot=${newBot.id}`);

    // Reset form states
    setName('');
    setDataSelection('');
    setInstructions('');
    setGuardrails('');
    setError('');
  };

  // Case 1: No model selected - Render Create New Model Form taking up the entire space
  if (!botParam) {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-[#FCFCFC] dark:bg-gray-950">
        <div className="flex-1 overflow-y-auto flex flex-col p-8 md:p-12 relative min-h-screen">
          {/* Subtle Dynamic Glows in the background */}
          <div className="absolute -top-40 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 -left-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <form onSubmit={handleFormSubmit} className="max-w-5xl w-full mx-auto space-y-8 relative z-10 py-4 flex-1 flex flex-col justify-between">
            
            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-900/50 rounded-xl p-3 text-xs text-red-600 dark:text-red-400 font-semibold">
                {error}
              </div>
            )}

            <div className="space-y-6 flex-1">
              {/* Box 1: Model Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-blue-500/60" />
                  Model Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Model Name"
                  className="w-full rounded-xl border-gray-200/80 bg-white/40 dark:bg-gray-900/40 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm py-6 px-4"
                />
              </div>

              {/* Box 2: Data (Knowledge Base) */}
              <div className="space-y-2">
                <Label
                  htmlFor="data"
                  className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5"
                >
                  <Database className="h-3.5 w-3.5 text-indigo-500/60" />
                  Data
                </Label>
                <select
                  id="data"
                  value={dataSelection}
                  onChange={(e) => setDataSelection(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white/40 dark:bg-gray-900/40 p-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-800 dark:text-gray-200 cursor-pointer"
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
              </div>

              {/* Box 3: Instructions */}
              <div className="space-y-2">
                <Label
                  htmlFor="instructions"
                  className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-500/60" />
                  Instructions
                </Label>
                <Textarea
                  id="instructions"
                  value={instructions}
                  onChange={(e) => {
                    setInstructions(e.target.value);
                    if (error) setError('');
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  placeholder="Instructions"
                  className="w-full min-h-[140px] resize-none overflow-hidden rounded-xl border-gray-200/80 bg-white/40 dark:bg-gray-900/40 p-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm leading-relaxed"
                />
              </div>

              {/* Box 4: Guardrails */}
              <div className="space-y-2">
                <Label
                  htmlFor="guardrails"
                  className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5"
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-rose-500/60" />
                  Guardrails
                </Label>
                <Textarea
                  id="guardrails"
                  value={guardrails}
                  onChange={(e) => {
                    setGuardrails(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  placeholder="Guardrails"
                  className="w-full min-h-[140px] resize-none overflow-hidden rounded-xl border-gray-200/80 bg-white/40 dark:bg-gray-900/40 p-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-12 py-4 text-xs font-bold shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/15 active:scale-95 transition-all w-full sm:w-auto"
              >
                Create Model
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Case 2: Custom model is selected - Render active chat workspace and right companion sidebar
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Middle Sandboxed Chat Interface */}
      <div
        className={cn(
          'flex flex-1 flex-col items-center justify-center relative overflow-y-auto h-full',
        )}
        style={{ backgroundColor: '#FCFCFC' }}
      >
        <h1 className="mb-8 text-4xl font-medium">
          Chat with {activeBot?.name || 'Models Sandbox'}
        </h1>

        <FullConversation conversationId="new-chat" />

        <p className="absolute bottom-3 text-xs text-neutral-500">
          We don’t train on your data. Your chats stay private.
        </p>
      </div>

      {/* Right Sidebar - Desktop Companion Menu (Mirroring the Left Menu) */}
      <div
        className={cn(
          'sticky top-0 right-0 hidden h-screen flex-col border-l border-black/10 transition-all duration-300 ease-in-out md:flex',
          isRightSidebarOpen ? 'w-68' : 'w-10',
        )}
        style={{ backgroundColor: '#F2F3F5' }}
      >
        <Suspense fallback={null}>
          <LeftSideNav side="right" />
        </Suspense>
      </div>
    </div>
  );
}

function ModelsPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500 font-semibold text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          Loading Models Page...
        </div>
      </div>
    }>
      <ModelsPageContent />
    </Suspense>
  );
}

export default ModelsPage;
