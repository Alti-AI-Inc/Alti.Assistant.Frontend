'use client';

import { Button } from '@/components/ui/button';
import { useBotsStore } from '@/stores/useBotsStore';
import { useModalStore } from '@/stores/useModalStore';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { MessageSquare, Plus, Trash2, Settings2, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BotRightSidebarProps {
  botId: string;
  activeThreadId: string | null;
}

export default function BotRightSidebar({ botId, activeThreadId }: BotRightSidebarProps) {
  const router = useRouter();
  const { onOpen } = useModalStore();
  const { bots, threads, deleteThread, setActiveBotThreadId } = useBotsStore();
  const { setActiveConversation } = useConversationsStore();

  const bot = bots.find((b) => b.id === botId);
  const botThreads = threads.filter((t) => t.botId === botId);

  const [isPromptExpanded, setIsPromptExpanded] = useState(true);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);

  if (!bot) return null;

  const handleNewChat = () => {
    setActiveBotThreadId(null);
    setActiveConversation(null);
    router.push(`/my-chatbots?bot=${botId}`);
  };

  const handleThreadSelect = (threadId: string) => {
    setActiveBotThreadId(threadId);
    router.push(`/my-chatbots?bot=${botId}&thread=${threadId}`);
  };

  const handleThreadDelete = (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation();
    deleteThread(threadId);
    if (activeThreadId === threadId) {
      router.push(`/my-chatbots?bot=${botId}`);
    }
  };

  return (
    <aside className="w-80 flex-none flex flex-col border-l border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-950/50 h-full overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-950">
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Bot Hub</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpen({ type: 'edit-chatbot', actionId: botId })}
          className="rounded-lg h-8 px-2.5 text-xs font-semibold gap-1 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Customize
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Action: New Chat */}
        <Button
          onClick={handleNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-5 text-xs font-bold gap-2 shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" /> New Conversation
        </Button>

        {/* Section: Chat History */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs">
          <button
            onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 text-left border-b border-gray-150 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">History ({botThreads.length})</span>
            {isHistoryExpanded ? <ChevronUp className="h-3.5 w-3.5 text-gray-500" /> : <ChevronDown className="h-3.5 w-3.5 text-gray-500" />}
          </button>

          {isHistoryExpanded && (
            <div className="p-2 max-h-64 overflow-y-auto space-y-1">
              {botThreads.length === 0 ? (
                <div className="p-3 text-center text-xs text-gray-400">
                  No past conversations.
                </div>
              ) : (
                botThreads.map((thread) => {
                  const isSelected = activeThreadId === thread.id;
                  return (
                    <div
                      key={thread.id}
                      onClick={() => handleThreadSelect(thread.id)}
                      className={cn(
                        "group flex items-center justify-between rounded-xl p-2.5 text-left text-xs cursor-pointer transition-all min-w-0 border border-transparent",
                        isSelected
                          ? "bg-blue-500/10 text-blue-600 font-bold border-blue-500/20"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-750 dark:text-gray-300"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <MessageSquare className="h-3.5 w-3.5 flex-none text-gray-400 group-hover:text-blue-500" />
                        <span className="truncate flex-1">{thread.title || 'Untitled Chat'}</span>
                      </div>
                      <button
                        onClick={(e) => handleThreadDelete(e, thread.id)}
                        className="opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 p-1 rounded-md transition-all flex-none"
                        title="Delete Thread"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Section: Profile & Config */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs">
          <button
            onClick={() => setIsPromptExpanded(!isPromptExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 text-left border-b border-gray-150 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5"><Info className="h-3.5 w-3.5 text-blue-500" /> Settings</span>
            {isPromptExpanded ? <ChevronUp className="h-3.5 w-3.5 text-gray-500" /> : <ChevronDown className="h-3.5 w-3.5 text-gray-500" />}
          </button>

          {isPromptExpanded && (
            <div className="p-4 space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">AI model</span>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-950 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800">
                  {bot.model || 'Gemini 1.5 Pro'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Instructions</span>
                <div className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800 max-h-40 overflow-y-auto whitespace-pre-wrap select-text scrollbar-thin">
                  {bot.instructions}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
