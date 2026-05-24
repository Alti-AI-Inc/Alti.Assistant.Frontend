'use client';

import { Button } from '@/components/ui/button';
import { useBotsStore } from '@/stores/useBotsStore';
import { useModalStore } from '@/stores/useModalStore';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { MessageSquare, Plus, Trash2, Settings2, Info, ChevronDown, ChevronUp, PanelLeft, PanelLeftClose, Search } from 'lucide-react';
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
  const { isLeftSidebarOpen, toggleLeftSidebar } = useSidebarStore();

  const bot = bots.find((b) => b.id === botId);
  const botThreads = threads.filter((t) => t.botId === botId);

  const [searchQuery, setSearchQuery] = useState('');
  const [isPromptExpanded, setIsPromptExpanded] = useState(true);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);

  const filteredThreads = botThreads.filter((t) =>
    (t.title || 'Untitled Chat').toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <aside className="w-68 flex-none flex flex-col border-l border-black/10 h-full overflow-hidden transition-all duration-300" style={{ backgroundColor: '#F2F3F5' }}>
      {/* Header matching left side menu */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-black/10 px-4 pt-4 pb-4 flex-none"
        style={{ backgroundColor: '#F2F3F5' }}
      >
        <PanelLeftClose
          className="size-5 cursor-pointer text-gray-600 transition-transform duration-300"
          onClick={toggleLeftSidebar}
        />

        <span className="text-sm font-bold text-gray-850 dark:text-gray-200">
          {bot.name}
        </span>
      </header>

      {/* Search & Actions Row matching left side menu */}
      <div
        className="flex items-center justify-between gap-2 border-b border-black/10 px-4 py-4 transition-all duration-300 flex-none"
        style={{ backgroundColor: '#F2F3F5' }}
      >
        {/* Search Bar Input */}
        <div className="flex h-8 flex-1 items-center gap-2 rounded-lg border border-black/10 bg-white px-3 shadow-xs transition-all focus-within:ring-1 focus-within:ring-black/20">
          <Search className="size-3.5 flex-none text-black" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-black outline-none placeholder:text-gray-500"
          />
        </div>

        {/* Action Button: New Chat */}
        <Button
          variant="outline"
          size="icon"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-black shadow-xs transition-all hover:bg-black/[0.03] hover:text-black flex-none"
          onClick={handleNewChat}
          title="New Conversation"
        >
          <Plus className="size-4 text-black" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6" style={{ backgroundColor: '#F2F3F5' }}>
        {/* Section: Chat History */}
        <div className="space-y-2">
          <div className="px-1 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              History ({filteredThreads.length})
            </span>
          </div>

          <div className="space-y-1 max-h-64 overflow-y-auto">
            {filteredThreads.length === 0 ? (
              <div className="p-3 text-center text-xs text-gray-400">
                {searchQuery ? 'No matching chats.' : 'No past conversations.'}
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isSelected = activeThreadId === thread.id;
                return (
                  <div
                    key={thread.id}
                    onClick={() => handleThreadSelect(thread.id)}
                    className={cn(
                      "group flex items-center justify-between rounded-lg p-2.5 text-left text-xs cursor-pointer transition-all min-w-0 border",
                      isSelected
                        ? "bg-black/[0.06] border-black/10 shadow-xs text-black font-bold"
                        : "hover:bg-black/[0.03] border-transparent text-gray-750 dark:text-gray-305"
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
        </div>

        {/* Section: Settings */}
        <div className="space-y-2">
          <div className="px-1 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Settings
            </span>
          </div>

          <div className="p-3 bg-black/[0.02] border border-black/5 rounded-xl space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-450 uppercase tracking-wider">AI model</span>
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-950 px-2.5 py-1.5 rounded-lg border border-black/5 shadow-2xs">
                {bot.model || 'Gemini 1.5 Pro'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-450 uppercase tracking-wider">Instructions</span>
              <div className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-950 p-2.5 rounded-lg border border-black/5 max-h-40 overflow-y-auto whitespace-pre-wrap select-text scrollbar-thin shadow-2xs">
                {bot.instructions}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpen({ type: 'edit-chatbot', actionId: botId })}
              className="w-full rounded-xl py-4 text-xs font-semibold gap-1 hover:bg-black/[0.03] bg-white border border-black/10 text-black mt-2 shadow-xs"
            >
              Customize Agent Prompt
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
