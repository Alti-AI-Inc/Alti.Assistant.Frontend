'use client';

import { Button } from '@/components/ui/button';
import { useBotsStore } from '@/stores/useBotsStore';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { Plus, Trash2, PanelLeftClose, Search, MessageSquare, FileText, Shield, Upload } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { getFileIconComponent } from './ProjectEditors';

interface BotRightSidebarProps {
  botId: string;
  activeThreadId: string | null;
}

type TabType = 'history' | 'instructions' | 'guardrails' | 'data';

export default function BotRightSidebar({ botId, activeThreadId }: BotRightSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const basePath = pathname?.startsWith('/admin') ? '/admin/projects' : '/my-chatbots';
  const { bots, threads, deleteThread, setActiveBotThreadId, editBot } = useBotsStore();
  const { setActiveConversation } = useConversationsStore();
  const { isRightSidebarOpen, toggleRightSidebar } = useSidebarStore();

  const bot = bots.find((b) => b.id === botId);
  const botThreads = threads.filter((t) => t.botId === botId);

  const [searchQuery, setSearchQuery] = useState('');
  
  // Tab State is now derived from URL
  const activeTab = basePath === '/admin/projects' ? 'history' : ((searchParams.get('view') as TabType) || 'history');
  
  const handleTabChange = (tab: TabType) => {
    // If selecting history, clear the view parameter so it shows the chat
    if (tab === 'history') {
      router.push(`${basePath}?bot=${botId}`);
    } else {
      router.push(`${basePath}?bot=${botId}&view=${tab}`);
    }
  };

  const filteredThreads = botThreads.filter((t) =>
    (t.title || 'Untitled Chat').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!bot) return null;

  const handleNewChat = () => {
    setActiveBotThreadId(null);
    setActiveConversation(null);
    router.push(`${basePath}?bot=${botId}`);
  };

  const handleThreadSelect = (threadId: string) => {
    setActiveBotThreadId(threadId);
    router.push(`${basePath}?bot=${botId}&thread=${threadId}`);
  };

  const handleThreadDelete = (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation();
    deleteThread(threadId);
    if (activeThreadId === threadId) {
      router.push(`${basePath}?bot=${botId}`);
    }
  };

  const hideSidebar = !isRightSidebarOpen;

  const parsedInstructions = bot.instructions ? bot.instructions.split('\n\n').filter(Boolean) : [];
  const parsedGuardrails = bot.guardrails ? bot.guardrails.split('\n\n').filter(Boolean) : [];

  return (
    <aside
      className={cn(
        "flex-none flex flex-col border-l border-black/10 h-full overflow-hidden transition-all duration-300",
        hideSidebar ? "w-10" : "w-76"
      )}
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Header matching left side menu */}
      <header
        className={cn(
          "sticky top-0 z-30 flex items-center justify-between border-b border-black/10 pt-4 pb-4 flex-none",
          hideSidebar ? "px-0 justify-center" : "px-4"
        )}
        style={{ backgroundColor: '#FFFFFF' }}
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
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div className="flex items-center justify-between gap-2">
             {/* Search Bar Input */}
            <div className="flex h-8 flex-1 items-center gap-2 rounded-lg border border-black/10 bg-[#F5F5F7] px-3 shadow-xs transition-all focus-within:ring-1 focus-within:ring-black/20">
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
            {activeTab === 'history' && (
              <Button
                variant="outline"
                size="icon"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-[#F5F5F7] text-black shadow-xs transition-all hover:bg-black/[0.03] hover:text-black flex-none dark:bg-zinc-800/50 dark:text-white"
                onClick={handleNewChat}
                title="New Conversation"
              >
                <Plus className="size-4 text-black" />
              </Button>
            )}
          </div>


          {/* Toggle with 4 icons */}
          {(basePath === '/admin/projects' || !bot.isShared) && (
            <>
              <div className="h-px w-[calc(100%+2rem)] -ml-4 bg-black/10 mt-2" />
              <div className="h-10 mt-2 flex items-center bg-[#FFFFFF] dark:bg-zinc-900 transition-colors duration-300 w-full">
                <div className="flex bg-black/[0.04] dark:bg-white/[0.04] p-1 rounded-xl w-full justify-between items-center gap-1 border border-black/[0.03] dark:border-white/[0.03]">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => handleTabChange('history')}
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

              {(basePath === '/admin/projects' || !bot.isShared) && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                    type="button"
                    onClick={() => handleTabChange('instructions')}
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
                    onClick={() => handleTabChange('guardrails')}
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
                    onClick={() => handleTabChange('data')}
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
                </>
              )}
            </div>
          </div>
            </>
          )}
        </div>
      )}

      {/* Main Content Area based on Active Tab */}
      {!hideSidebar && (
        <div
          className="flex flex-1 flex-col overflow-y-auto px-4 pb-4"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          {activeTab === 'history' && (
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
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 p-1.5 rounded-md transition-all flex-none mr-1"
                            title="Delete Thread"
                          >
                            <Trash2 className="size-3.5 text-black" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[400px] sm:max-w-[400px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
                          <div className="px-5 pt-5 pb-4 text-center">
                            <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
                              Delete Thread
                            </h2>
                            <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1">
                              Are you sure you want to delete this thread?
                            </p>
                          </div>
                          <div className="border-t border-black/10 dark:border-white/10 flex h-11">
                            <DialogClose asChild>
                              <button className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center border-r border-black/10 dark:border-white/10 outline-none">
                                Cancel
                              </button>
                            </DialogClose>
                            <DialogClose asChild>
                              <button 
                                onClick={(e) => handleThreadDelete(e, thread.id)}
                                className="flex-1 text-[15px] font-medium text-red-500 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none"
                              >
                                Delete
                              </button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="flex-1 space-y-1 py-1 pb-4 pt-4 animate-in fade-in zoom-in-95 duration-200">
              {parsedInstructions.length === 0 ? (
                <div className="py-4 text-center text-xs text-gray-400">
                  No instructions added yet.
                </div>
              ) : (
                parsedInstructions.map((inst, index) => (
                  <div
                    key={index}
                    className="group flex h-9 w-full items-center justify-between rounded-md text-sm font-normal text-black text-left transition-all hover:bg-black/5"
                  >
                    <span
                      className="flex-1 cursor-pointer truncate px-1 py-2"
                      onClick={() => handleTabChange('instructions')}
                    >
                      {inst.length > 30 ? inst.slice(0, 30) + '...' : inst}
                    </span>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 p-1.5 rounded-md transition-all flex-none mr-1"
                          title="Delete Instruction"
                        >
                          <Trash2 className="size-3.5 text-black" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[400px] sm:max-w-[400px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
                        <div className="px-5 pt-5 pb-4 text-center">
                          <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
                            Delete Instruction
                          </h2>
                          <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1">
                            Are you sure you want to remove this instruction?
                          </p>
                        </div>
                        <div className="border-t border-black/10 dark:border-white/10 flex h-11">
                          <DialogClose asChild>
                            <button className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center border-r border-black/10 dark:border-white/10 outline-none">
                              Cancel
                            </button>
                          </DialogClose>
                          <DialogClose asChild>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const newList = parsedInstructions.filter((_, i) => i !== index);
                                editBot(botId, { instructions: newList.join('\n\n') });
                              }}
                              className="flex-1 text-[15px] font-medium text-red-500 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none"
                            >
                              Delete
                            </button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'guardrails' && (
            <div className="flex-1 space-y-1 py-1 pb-4 pt-4 animate-in fade-in zoom-in-95 duration-200">
              {parsedGuardrails.length === 0 ? (
                <div className="py-4 text-center text-xs text-gray-400">
                  No guardrails added yet.
                </div>
              ) : (
                parsedGuardrails.map((guard, index) => (
                  <div
                    key={index}
                    className="group flex h-9 w-full items-center justify-between rounded-md text-sm font-normal text-black text-left transition-all hover:bg-black/5"
                  >
                    <span
                      className="flex-1 cursor-pointer truncate px-1 py-2"
                      onClick={() => handleTabChange('guardrails')}
                    >
                      {guard.length > 30 ? guard.slice(0, 30) + '...' : guard}
                    </span>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 p-1.5 rounded-md transition-all flex-none mr-1"
                          title="Delete Guardrail"
                        >
                          <Trash2 className="size-3.5 text-black" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[400px] sm:max-w-[400px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
                        <div className="px-5 pt-5 pb-4 text-center">
                          <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
                            Delete Guardrail
                          </h2>
                          <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1">
                            Are you sure you want to remove this constraint?
                          </p>
                        </div>
                        <div className="border-t border-black/10 dark:border-white/10 flex h-11">
                          <DialogClose asChild>
                            <button className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center border-r border-black/10 dark:border-white/10 outline-none">
                              Cancel
                            </button>
                          </DialogClose>
                          <DialogClose asChild>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const newList = parsedGuardrails.filter((_, i) => i !== index);
                                editBot(botId, { guardrails: newList.join('\n\n') });
                              }}
                              className="flex-1 text-[15px] font-medium text-red-500 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none"
                            >
                              Delete
                            </button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'data' && (
            <div className="flex-1 space-y-1 py-1 pb-4 pt-4 animate-in fade-in zoom-in-95 duration-200">
              {bot.data ? (
                (() => {
                  let files: { name: string, size: number }[] = [];
                  try {
                    files = JSON.parse(bot.data);
                  } catch (e) {
                    files = [{ name: bot.data, size: 0 }];
                  }
                  
                  if (files.length === 0) {
                    return (
                      <div className="py-4 text-center text-xs text-gray-400">
                        No data connected.
                      </div>
                    );
                  }

                  return files.map((file, idx) => {
                    const IconComponent = getFileIconComponent(file.name);
                    return (
                      <div key={idx} className="group flex h-9 w-full items-center justify-between rounded-md text-sm font-normal text-black text-left transition-all hover:bg-black/5">
                        <div className="flex items-center flex-1 min-w-0 px-1 py-2 cursor-pointer" onClick={() => handleTabChange('data')}>
                          <IconComponent className="size-3.5 mr-2 flex-shrink-0 text-blue-600 opacity-70" />
                          <span className="truncate">
                            {file.name}
                          </span>
                        </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 p-1.5 rounded-md transition-all flex-none mr-1"
                            title="Disconnect Data"
                          >
                            <Trash2 className="size-3.5 text-black" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[400px] sm:max-w-[400px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
                          <div className="px-5 pt-5 pb-4 text-center">
                            <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
                              Disconnect Data
                            </h2>
                            <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1">
                              Are you sure you want to remove this data file?
                            </p>
                          </div>
                          <div className="border-t border-black/10 dark:border-white/10 flex h-11">
                            <DialogClose asChild>
                              <button className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center border-r border-black/10 dark:border-white/10 outline-none">
                                Cancel
                              </button>
                            </DialogClose>
                            <DialogClose asChild>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const merged = files.filter((_, i) => i !== idx);
                                  if (merged.length === 0) {
                                    editBot(botId, { data: undefined });
                                  } else {
                                    editBot(botId, { data: JSON.stringify(merged) });
                                  }
                                }}
                                className="flex-1 text-[15px] font-medium text-red-500 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none"
                              >
                                Delete
                              </button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    );
                  });
                })()
              ) : (
                <div className="py-4 text-center text-xs text-gray-400">
                  No data connected.
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </aside>
  );
}
