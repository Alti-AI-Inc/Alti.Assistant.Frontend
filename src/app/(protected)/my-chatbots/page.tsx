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
import { Sparkles, Plus, ArrowRight, Bot, PanelLeft, PanelLeftClose } from 'lucide-react';
import { cn } from '@/lib/utils';



function MyChatbotsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { onOpen } = useModalStore();
  const { isLeftSidebarOpen, toggleLeftSidebar } = useSidebarStore();

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

  // Render Dashboard Library Grid
  if (!activeBot) {
    return (
      <div className="flex-1 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl flex items-center justify-between">
          <div className="space-y-3 max-w-lg z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="h-3 w-3" /> Custom Personas
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">Meet Your Specialized Agents</h1>
            <p className="text-sm text-blue-100 leading-relaxed">
              Create and talk to custom assistants pre-loaded with specialized rules, guidelines, system prompts, and AI personalities.
            </p>
          </div>
          <div className="hidden lg:block text-white/10 absolute -right-10 -bottom-10 scale-150 transform">
            <Bot className="h-48 w-48 stroke-[1px]" />
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">Active Agents</h2>
            <p className="text-xs text-gray-500">Pick an agent to begin chatting or build your own custom assistant.</p>
          </div>
          <Button
            onClick={() => onOpen({ type: 'add-chatbot' })}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold px-4 py-2 flex items-center gap-1.5 shadow-sm text-xs"
          >
            <Plus className="h-4 w-4" /> Create Custom Agent
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => {
            return (
              <div
                key={bot.id}
                onClick={() => {
                  setActiveBotId(bot.id);
                  router.push(`/my-chatbots?bot=${bot.id}`);
                }}
                className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-xs transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer dark:border-gray-800 dark:bg-gray-950"
              >
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-950 dark:text-gray-50 text-sm group-hover:text-blue-600 transition-colors">
                    {bot.name}
                  </h3>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4 text-xs font-semibold text-gray-400 group-hover:text-blue-600 transition-colors">
                  <span>Enter workspace</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}

          {/* Dotted Create Bot Card */}
          <div
            onClick={() => onOpen({ type: 'add-chatbot' })}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center hover:border-blue-500 hover:bg-blue-500/[0.02] transition-all cursor-pointer group dark:border-gray-800"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              <Plus className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-bold text-gray-900 dark:text-gray-50 text-sm">Create New Agent</h3>
            <p className="mt-1 text-xs text-gray-500 max-w-[200px]">
              Set custom instructions, models, and pick a custom icon.
            </p>
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
        {/* Top section matching left side menu */}
        <header
          className="h-14 border-b border-black/10 flex items-center justify-between px-6 flex-none"
          style={{ backgroundColor: '#F2F3F5' }}
        >
          <button
            onClick={toggleLeftSidebar}
            className="p-1 rounded-md hover:bg-black/5 transition-colors"
          >
            {isLeftSidebarOpen ? (
              <PanelLeftClose className="size-5 text-gray-600" />
            ) : (
              <PanelLeft className="size-5 text-gray-600" />
            )}
          </button>

          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
            {activeBot.name}
          </span>
        </header>

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
