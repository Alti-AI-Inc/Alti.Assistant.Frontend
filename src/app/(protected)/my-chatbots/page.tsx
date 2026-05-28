'use client';

export const dynamic = 'force-dynamic';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useState, useRef } from 'react';
import { useBotsStore } from '@/stores/useBotsStore';
import { useModalStore } from '@/stores/useModalStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import FullConversation from '@/app/(protected)/c/[id]/_components/FullConversation';
import BotRightSidebar from '@/components/panels/BotRightSidebar';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Plus, 
  ArrowUp,
  Loader2 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper to dynamically extract project name from first few words of the prompt
const generateProjectNameFromPrompt = (text: string): string => {
  const trimmed = text.trim();
  if (!trimmed) return 'New Project';
  
  // Clean up punctuation, get first few words
  const words = trimmed
    .replace(/[^\w\s-]/g, '') // remove special characters but keep spaces
    .split(/\s+/)
    .filter(Boolean);
    
  if (words.length === 0) return 'New Project';
  
  // Take up to 4 words
  const nameWords = words.slice(0, 4);
  let derived = nameWords.join(' ');
  
  // Capitalize first letter of each word
  derived = derived
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
    
  if (derived.length > 25) {
    derived = derived.substring(0, 22) + '...';
  }
  
  return derived;
};

function MyChatbotsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { bots, activeBotId, activeBotThreadId, setActiveBotId, setActiveBotThreadId, addBot } = useBotsStore();
  const { setActiveConversation } = useConversationsStore();

  // State for single-prompt chatbot project creation
  const [prompt, setPrompt] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  // Read URL params
  const botParam = searchParams?.get('bot');
  const threadParam = searchParams?.get('thread');

  // Sync state with URL params
  useEffect(() => {
    if (botParam) {
      setActiveBotId(botParam);
    } else {
      setActiveBotId(null);
    }

    if (threadParam) {
      setActiveBotThreadId(threadParam);
    } else {
      setActiveBotThreadId(null);
      setActiveConversation(null);
    }
  }, [botParam, threadParam, setActiveBotId, setActiveBotThreadId, setActiveConversation]);

  const activeBot = bots.find((b) => b.id === activeBotId);

  // Form Submission
  const handleCreateProject = async () => {
    if (!prompt.trim()) return;

    setIsCreating(true);
    setError('');

    try {
      // 1. Generate smart project title from prompt
      const generatedName = generateProjectNameFromPrompt(prompt);

      // 2. Initialize project workspace chatbot using prompt as system instructions
      const newBot = addBot({
        name: generatedName,
        description: 'Isolated Custom Project Workspace',
        instructions: prompt,
        model: 'Gemini 1.5 Pro',
        avatar: '🤖',
      });

      toast.success('Project Workspace successfully initialized!');

      // 3. Immediately select newly created bot and route to live session
      setActiveBotId(newBot.id);
      router.push(`/my-chatbots?bot=${newBot.id}`);

      // Reset Prompt
      setPrompt('');
    } catch (err: any) {
      console.error('Error creating project:', err);
      setError(err.message || 'An error occurred during project workspace creation.');
    } finally {
      setIsCreating(false);
    }
  };

  // Render Focused Projects Workspace Dashboard (when no active bot)
  if (!activeBot) {
    return (
      <div className="flex-grow overflow-y-auto w-full bg-[#FCFCFC] dark:bg-zinc-950 h-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
        <div className="mx-auto w-full max-w-[796px] px-4 flex flex-col items-center">
          
          <h1 className="text-3xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 text-center select-none">
            Create New Project
          </h1>

          {error && (
            <p className="w-full text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl mb-4 animate-in slide-in-from-top-1 duration-150 text-center">
              {error}
            </p>
          )}

          <div className="w-full flex flex-col rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 px-3 shadow-sm sm:px-4 py-1.5 transition-all duration-300">
            <div className="relative flex items-center gap-2 py-2">
              
              {/* Decorative Plus Button to match ChatInput style */}
              <div className="flex items-center focus:outline-none select-none">
                <Plus className="size-7 flex-shrink-0 rounded-lg border-2 border-gray-300 dark:border-zinc-700 bg-black dark:bg-zinc-800 p-1.5 text-white transition-colors cursor-default" />
              </div>

              <Textarea
                name="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCreateProject();
                  }
                }}
                placeholder="Describe your new project... (e.g., Build a marketing partner that writes copy)"
                className="min-h-8 w-full flex-1 resize-none border-none bg-transparent px-2 py-2 shadow-none outline-none placeholder:text-sm text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-0 text-gray-800 dark:text-zinc-100"
                autoFocus
                rows={1}
              />

              <button
                type="button"
                onClick={() => handleCreateProject()}
                disabled={isCreating || !prompt.trim()}
                className={cn(
                  'size-7 flex-shrink-0 flex items-center justify-center rounded-lg border-2 border-gray-300 dark:border-zinc-700 bg-black dark:bg-zinc-850 p-1 text-white transition-opacity',
                  (!prompt.trim() || isCreating)
                    ? 'cursor-not-allowed opacity-30'
                    : 'cursor-pointer hover:bg-zinc-850 dark:hover:bg-zinc-700'
                )}
                aria-label="Create Project"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <ArrowUp className="h-4 w-4 text-white" />
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Render 3-Column Chatbot Workspace
  return (
    <div className="flex h-full w-full bg-[#FCFCFC] dark:bg-gray-950 overflow-hidden">
      {/* Center Panel (Conversation / Interface) */}
      <div
        className="flex-1 flex flex-col min-w-0 h-full relative"
        style={{ backgroundColor: '#FCFCFC' }}
      >
        {/* Chatbot Content Body */}
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden relative">
          {!activeBotThreadId && (
            <h1 className="mb-8 text-4xl font-medium text-gray-900 dark:text-white tracking-tight">
              {activeBot.name}
            </h1>
          )}

          <FullConversation conversationId={activeBotThreadId || 'new-chat'} />

          {!activeBotThreadId && (
            <p className="absolute bottom-3 text-xs text-neutral-500">
              We don&apos;t train on your data. Your chats stay private.
            </p>
          )}
        </div>
      </div>

      {/* Right Column (Bot Specific Details & Timeline) */}
      <BotRightSidebar botId={activeBot.id} activeThreadId={activeBotThreadId} />
    </div>
  );
}

export default function MyChatbotsPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500 font-semibold text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          Loading Chatbot Workspace...
        </div>
      </div>
    }>
      <MyChatbotsContent />
    </Suspense>
  );
}
