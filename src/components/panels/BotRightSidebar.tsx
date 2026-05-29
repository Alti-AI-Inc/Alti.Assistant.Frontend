'use client';

import { Button } from '@/components/ui/button';
import { useBotsStore } from '@/stores/useBotsStore';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { Plus, Trash2, PanelLeftClose, Search, MessageSquare, FileText, Shield, Upload } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

interface BotRightSidebarProps {
  botId: string;
  activeThreadId: string | null;
}

type TabType = 'history' | 'instructions' | 'guardrails' | 'data';

export default function BotRightSidebar({ botId, activeThreadId }: BotRightSidebarProps) {
  const router = useRouter();
  const { bots, threads, deleteThread, setActiveBotThreadId, editBot } = useBotsStore();
  const { setActiveConversation } = useConversationsStore();
  const { isRightSidebarOpen, toggleRightSidebar } = useSidebarStore();

  const bot = bots.find((b) => b.id === botId);
  const botThreads = threads.filter((t) => t.botId === botId);

  const [searchQuery, setSearchQuery] = useState('');
  
  // Tab State
  const [activeTab, setActiveTab] = useState<TabType>('history');
  
  // Editor State
  const [instructionsText, setInstructionsText] = useState(bot?.instructions || '');
  const [guardrailsText, setGuardrailsText] = useState(bot?.guardrails || '');

  useEffect(() => {
    if (bot) {
      setInstructionsText(bot.instructions || '');
      setGuardrailsText(bot.guardrails || '');
    }
  }, [bot]);

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

  const handleSaveInstructions = () => {
    editBot(botId, { instructions: instructionsText });
  };

  const handleSaveGuardrails = () => {
    editBot(botId, { guardrails: guardrailsText });
  };

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
          "sticky top-0 z-30 flex items-center justify-between border-b border-black/10 pt-4 pb-4 flex-none",
          hideSidebar ? "px-0 justify-center" : "px-4"
        )}
        style={{ backgroundColor: '#F2F3F5' }}
      >
        <PanelLeftClose
          className={cn(
            "size-5 cursor-pointer text-gray-600 transition-transform duration-300 flex-none",
            !hideSidebar && "scale-x-[-1]"
          )}
          onClick={toggleRightSidebar}
        />

        {!hideSidebar && (
          <span className="text-sm font-normal text-gray-850 dark:text-gray-200">
            {bot.name}
          </span>
        )}
      </header>

      {/* Search & Actions Row */}
      {!hideSidebar && (
        <div
          className="flex flex-col gap-2 border-b border-black/10 px-4 py-4 transition-all duration-300 flex-none"
          style={{ backgroundColor: '#F2F3F5' }}
        >
          <div className="flex items-center justify-between gap-2">
            {/* Search Bar Input */}
            <div className="flex h-8 flex-1 items-center gap-2 rounded-lg border border-black/10 bg-white px-3 shadow-xs transition-all focus-within:ring-1 focus-within:ring-black/20">
              <Search className="size-3.5 flex-none text-black" />
              <input
                type="text"
                placeholder="Search..."
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

          {/* Toggle with 4 icons */}
          <div className="h-10 mt-1 flex items-center bg-[#F2F3F5] dark:bg-zinc-900 transition-colors duration-300 w-full">
            <div className="flex bg-black/[0.04] dark:bg-white/[0.04] p-1 rounded-xl w-full justify-between items-center gap-1 border border-black/[0.03] dark:border-white/[0.03]">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none',
                      activeTab === 'history'
                        ? 'bg-white border-black/10 text-black shadow-xs scale-105'
                        : 'bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800',
                    )}
                  >
                    <MessageSquare className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Chat History</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setActiveTab('instructions')}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none',
                      activeTab === 'instructions'
                        ? 'bg-white border-black/10 text-black shadow-xs scale-105'
                        : 'bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800',
                    )}
                  >
                    <FileText className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Instructions</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setActiveTab('guardrails')}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none',
                      activeTab === 'guardrails'
                        ? 'bg-white border-black/10 text-black shadow-xs scale-105'
                        : 'bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800',
                    )}
                  >
                    <Shield className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Guardrails</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setActiveTab('data')}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none',
                      activeTab === 'data'
                        ? 'bg-white border-black/10 text-black shadow-xs scale-105'
                        : 'bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800',
                    )}
                  >
                    <Upload className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Data</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area based on Active Tab */}
      {!hideSidebar && (
        <div
          className="flex flex-1 flex-col overflow-y-auto px-4 pb-4"
          style={{ backgroundColor: '#F2F3F5' }}
        >
          {activeTab === 'history' && (
            <>
              <div className="flex-1 space-y-1 py-1 pb-4 pt-4">
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
                          "group flex h-9 w-full items-center justify-between rounded-md text-sm font-normal text-black text-left transition-all",
                          isSelected ? "bg-black/10 font-medium" : "hover:bg-black/5"
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
            </>
          )}

          {activeTab === 'instructions' && (
            <div className="flex flex-col h-full mt-4 animate-in fade-in zoom-in-95 duration-200">
              <Textarea 
                value={instructionsText}
                onChange={(e) => setInstructionsText(e.target.value)}
                className="flex-1 min-h-[300px] resize-none bg-white border-black/10 text-sm p-3 shadow-xs focus-visible:ring-1 focus-visible:ring-black/20 rounded-xl"
                placeholder="Enter system instructions for this project..."
              />
              <Button 
                onClick={handleSaveInstructions}
                className="mt-4 w-full bg-black text-white hover:bg-black/90 rounded-xl py-5 shadow-sm"
              >
                Save Instructions
              </Button>
            </div>
          )}

          {activeTab === 'guardrails' && (
            <div className="flex flex-col h-full mt-4 animate-in fade-in zoom-in-95 duration-200">
              <Textarea 
                value={guardrailsText}
                onChange={(e) => setGuardrailsText(e.target.value)}
                className="flex-1 min-h-[300px] resize-none bg-white border-black/10 text-sm p-3 shadow-xs focus-visible:ring-1 focus-visible:ring-black/20 rounded-xl"
                placeholder="Define rules and constraints..."
              />
              <Button 
                onClick={handleSaveGuardrails}
                className="mt-4 w-full bg-black text-white hover:bg-black/90 rounded-xl py-5 shadow-sm"
              >
                Save Guardrails
              </Button>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="flex flex-col h-full mt-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex flex-col items-center justify-center flex-1 min-h-[300px] rounded-xl border border-dashed border-black/20 bg-black/5 p-6 text-center">
                <Upload className="size-8 text-gray-400 mb-3" />
                <h3 className="text-sm font-semibold text-gray-800 mb-1">Knowledge Base</h3>
                <p className="text-xs text-gray-500">
                  Data uploaded during project creation is active. Editing or uploading new files directly from the sidebar is coming soon!
                </p>
              </div>
            </div>
          )}

        </div>
      )}
    </aside>
  );
}
