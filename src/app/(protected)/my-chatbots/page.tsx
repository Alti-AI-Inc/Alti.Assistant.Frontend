'use client';

export const dynamic = 'force-dynamic';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useBotsStore, Chatbot } from '@/stores/useBotsStore';
import { useModalStore } from '@/stores/useModalStore';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { PostConversation } from '@/actions/conversationsAction';
import FullConversation from '@/app/(protected)/c/[id]/_components/FullConversation';
import BotRightSidebar from '@/components/panels/BotRightSidebar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Plus, ArrowRight, Bot, ArrowLeft, SendHorizontal, Code2, Palette, PenTool, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEFAULT_PROMPTS: Record<string, string[]> = {
  'python-expert': [
    'Draft a clean, PEP-8 compliant decorator for logging execution time in Python.',
    'Explain how to optimize a dictionary lookup with millions of keys in Python.',
  ],
  'ui-design-guru': [
    'Design a beautiful, responsive landing page hero section in Tailwind CSS.',
    'Create a cohesive, luxurious dark mode HSL palette for a SaaS dashboard.',
  ],
  'copywriter': [
    'Draft a high-conversion sales email pitching an automated AI developer tool.',
    'Create five catchy headlines for a blog post about software architecture best practices.',
  ],
  'general-assistant': [
    'Help me brainstorm five innovative startup ideas in the renewable energy space.',
    'Write a polite letter requesting an extension on a project deadline.',
  ],
};

const DEFAULT_ICONS: Record<string, any> = {
  'python-expert': Code2,
  'ui-design-guru': Palette,
  'copywriter': PenTool,
  'general-assistant': BrainCircuit,
};

function MyChatbotsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { onOpen } = useModalStore();

  const { bots, activeBotId, activeBotThreadId, setActiveBotId, setActiveBotThreadId, addThread } = useBotsStore();
  const { setActiveConversation } = useConversationsStore();

  // Read URL params
  const botParam = searchParams?.get('bot');
  const threadParam = searchParams?.get('thread');

  const [message, setMessage] = useState('');
  const [isStarting, setIsStarting] = useState(false);

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

  // Handle submit for starting a new bot thread
  const handleFirstMessageSubmit = async (text: string) => {
    if (!text.trim() || !session?.accessToken || !activeBot) return;
    setIsStarting(true);

    try {
      // Inject instructions into first message
      const fullMessage = `[System Instructions: ${activeBot.instructions}]\n\nUser Message: ${text}`;
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/orchestrator/route-prompt`;

      const response = await PostConversation(
        apiUrl,
        fullMessage,
        session.accessToken
      );

      if (response.success && response.data?.conversationId) {
        const newThreadId = response.data.conversationId;
        
        // Save thread mapping locally
        addThread(activeBot.id, newThreadId, text.substring(0, 40));
        
        // Sync Zustand conversations state
        setActiveConversation({
          conversationId: newThreadId,
          messages: [
            { role: 'user' as any, content: text, timestamp: new Date().toISOString() },
            { role: 'assistant' as any, content: response.data.responseMessage?.answer || response.data.message || '', timestamp: new Date().toISOString() }
          ]
        });

        // Dynamic URL redirection inside the Bot workspace
        router.push(`/my-chatbots?bot=${activeBot.id}&thread=${newThreadId}`);
      } else {
        console.error('Failed to initialize chatbot conversation:', response.message);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    } finally {
      setIsStarting(false);
      setMessage('');
    }
  };

  const activeIcon = activeBot ? (DEFAULT_ICONS[activeBot.id] || Bot) : Bot;

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
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Content Body */}
        <div className="flex-1 overflow-hidden relative">
          {activeBotThreadId ? (
            /* Active Chat Thread Mode (Wraps standard FullConversation seamlessly) */
            <FullConversation conversationId={activeBotThreadId} />
          ) : (
            /* New Chat Welcome Mode */
            <div className="absolute inset-0 flex flex-col justify-between overflow-y-auto bg-gray-50/20 dark:bg-gray-950/20">
              {/* Welcome Banner */}
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/10 text-5xl border border-black/5 shadow-md">
                  {activeBot.avatar || '🤖'}
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-extrabold text-gray-950 dark:text-gray-50">
                    Talk with {activeBot.name}
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-md">
                    {activeBot.description}
                  </p>
                </div>

                {/* Quick Prompts */}
                {DEFAULT_PROMPTS[activeBot.id] && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl pt-4">
                    {DEFAULT_PROMPTS[activeBot.id].map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleFirstMessageSubmit(prompt)}
                        className="p-3.5 text-left rounded-xl border border-gray-200/80 bg-white hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 text-xs text-gray-700 hover:text-blue-600 transition-all font-semibold leading-relaxed shadow-2xs"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Chat Input Viewport */}
              <div className="p-4 sm:p-6 lg:p-8 flex-none w-full bg-white dark:bg-gray-950 border-t border-gray-150 dark:border-gray-800">
                <div className="max-w-2xl mx-auto flex items-end gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-2xl px-4 py-3 shadow-xs focus-within:ring-1 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 transition-all">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleFirstMessageSubmit(message);
                      }
                    }}
                    placeholder={`Message ${activeBot.name}...`}
                    className="flex-1 min-h-[24px] max-h-32 bg-transparent border-none outline-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0 text-xs p-0 leading-relaxed placeholder:text-gray-400 dark:bg-transparent"
                    rows={1}
                  />
                  <Button
                    onClick={() => handleFirstMessageSubmit(message)}
                    disabled={!message.trim() || isStarting}
                    className="flex-none bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-8 w-8 p-0 flex items-center justify-center shadow-xs"
                  >
                    {isStarting ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <SendHorizontal className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
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
