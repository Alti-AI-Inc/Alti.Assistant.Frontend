'use client';

export const dynamic = 'force-dynamic';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useBotsStore } from '@/stores/useBotsStore';
import { useModalStore } from '@/stores/useModalStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import FullConversation from '@/app/(protected)/c/[id]/_components/FullConversation';
import BotRightSidebar from '@/components/panels/BotRightSidebar';
import { Button } from '@/components/ui/button';
import { Sparkles, Plus, ArrowRight, Bot, PanelLeft, PanelLeftClose, FolderPlus } from 'lucide-react';
import { cn } from '@/lib/utils';



function MyChatbotsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { onOpen } = useModalStore();

  const { bots, activeBotId, activeBotThreadId, setActiveBotId, setActiveBotThreadId } = useBotsStore();

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
    }
  }, [botParam, threadParam, setActiveBotId, setActiveBotThreadId]);

  const activeBot = bots.find((b) => b.id === activeBotId);

  // Render Focused Projects Workspace Dashboard (when no bot is active)
  if (!activeBot) {
    return (
      <div className="flex-1 bg-white dark:bg-gray-950 min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 animate-in fade-in duration-500">
        
        {/* Soft elegant ambient light blobs */}
        <div className="absolute -top-40 right-20 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/10 to-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 left-20 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/10 to-pink-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Central Card */}
        <div className="w-full max-w-md text-center space-y-6 z-10">
          {/* Glowing Premium Icon Wrapper */}
          <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-2xl bg-blue-500/10 dark:bg-blue-500/5 blur-md animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 shadow-lg flex items-center justify-center backdrop-blur-md">
              <FolderPlus className="h-7 w-7 text-blue-600 dark:text-blue-500" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-950 dark:text-gray-50 tracking-tight">Specialized Project Hub</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
              Create an isolated project sandbox pre-loaded with specialized rules, guidelines, system prompts, and custom tools.
            </p>
          </div>

          {/* High Fidelity Button */}
          <div className="pt-2">
            <Button
              onClick={() => onOpen({ type: 'add-chatbot' })}
              className="px-6 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/10 flex items-center gap-2 font-semibold text-sm mx-auto transition-transform hover:scale-[1.01]"
            >
              <Plus className="h-4 w-4" />
              Create New Project
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render 3-Column Chatbot Workspace
  return (
    <div className="flex h-screen w-full bg-white dark:bg-gray-950 overflow-hidden">
      {/* Center Panel (Conversation / Interface) */}
      <div
        className="flex-1 flex flex-col min-w-0 h-full relative"
        style={{ backgroundColor: '#FCFCFC' }}
      >
        {/* Chatbot Content Body */}
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden relative">
          {!activeBotThreadId && (
            <h1 className="mb-8 text-4xl font-medium">
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
