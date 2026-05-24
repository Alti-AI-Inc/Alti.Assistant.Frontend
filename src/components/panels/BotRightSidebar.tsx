'use client';

import { Button } from '@/components/ui/button';
import { useBotsStore } from '@/stores/useBotsStore';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { Plus, Trash2, PanelLeftClose, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BotRightSidebarProps {
  botId: string;
  activeThreadId: string | null;
}

export default function BotRightSidebar({ botId, activeThreadId }: BotRightSidebarProps) {
  const router = useRouter();
  const { bots, threads, deleteThread, setActiveBotThreadId } = useBotsStore();
  const { setActiveConversation } = useConversationsStore();
  const { isRightSidebarOpen, toggleRightSidebar } = useSidebarStore();

  const bot = bots.find((b) => b.id === botId);
  const botThreads = threads.filter((t) => t.botId === botId);

  const [searchQuery, setSearchQuery] = useState('');

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

  const hideSidebar = !isRightSidebarOpen;

  return (
    <aside
      className={cn(
        "flex-none flex flex-col border-l border-black/10 h-full overflow-hidden transition-all duration-300",
        hideSidebar ? "w-10" : "w-68"
      )}
      style={{ backgroundColor: '#F2F3F5' }}
    >
      {/* Header matching left side menu */}
      <header
        className={cn(
          "sticky top-0 z-30 flex items-center justify-between border-b border-black/10 px-4 pt-4 pb-4 flex-none",
          hideSidebar && "justify-center"
        )}
        style={{ backgroundColor: '#F2F3F5' }}
      >
        <PanelLeftClose
          className={cn(
            "size-5 cursor-pointer text-gray-600 transition-transform duration-300",
            !hideSidebar && "scale-x-[-1]"
          )}
          onClick={toggleRightSidebar}
        />

        {!hideSidebar && (
          <span className="text-sm font-bold text-gray-850 dark:text-gray-200">
            {bot.name}
          </span>
        )}
      </header>

      {/* Search & Actions Row matching left side menu */}
      {!hideSidebar && (
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
      )}

      {/* Flat Text History List */}
      {!hideSidebar && (
        <div
          className="flex flex-1 flex-col overflow-y-auto px-4"
          style={{ backgroundColor: '#F2F3F5' }}
        >
          <div className="mt-4 mb-2 px-1 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Chat History
            </span>
          </div>

          <div className="flex-1 space-y-1 py-1 pb-4">
            {filteredThreads.length === 0 ? (
              <div className="py-4 text-center text-xs text-gray-400">
                {searchQuery ? 'No matching chats.' : 'No conversations yet. Start a new chat!'}
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isSelected = activeThreadId === thread.id;
                return (
                  <div
                    key={thread.id}
                    className={cn(
                      "group flex h-9 w-full items-center justify-between rounded-md text-sm font-medium text-black text-left transition-all",
                      isSelected ? "bg-black/10 font-semibold" : "hover:bg-black/5"
                    )}
                  >
                    <span
                      className="flex-1 cursor-pointer truncate px-1 py-2"
                      onClick={() => handleThreadSelect(thread.id)}
                    >
                      {thread.title || 'Untitled Chat'}
                    </span>
                    
                    <button
                      onClick={(e) => handleThreadDelete(e, thread.id)}
                      className="opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 p-1.5 rounded-md transition-all flex-none mr-1"
                      title="Delete Thread"
                    >
                      <Trash2 className="size-3.5 text-black" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
