'use client';

import { Button } from '@/components/ui/button';
import { useBotsStore } from '@/stores/useBotsStore';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { 
  Plus, 
  Trash2, 
  PanelLeftClose, 
  Search, 
  MessageSquare, 
  FileText, 
  Shield, 
  Upload, 
  Clock, 
  Repeat, 
  CalendarClock, 
  Zap 
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { OPTIONS } from '@/types/conversation';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getFileIconComponent } from './ProjectEditors';
import { toast } from 'sonner';

interface BotRightSidebarProps {
  botId: string;
  activeThreadId: string | null;
}

export default function BotRightSidebar({ botId, activeThreadId }: BotRightSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const basePath = pathname?.startsWith('/admin') ? '/admin/projects' : '/my-chatbots';
  const { bots, threads, deleteThread, setActiveBotThreadId, editBot } = useBotsStore();
  const { setActiveConversation, selectedOption, setSelectedOption } = useConversationsStore();
  const { isRightSidebarOpen, toggleRightSidebar } = useSidebarStore();

  const bot = bots.find((b) => b.id === botId);
  const botThreads = threads.filter((t) => t.botId === botId);

  const [searchQuery, setSearchQuery] = useState('');
  
  // Local Config Tab State
  const [configTab, setConfigTab] = useState<'instructions' | 'guardrails' | 'data'>('instructions');
  
  // Local Activity Tab State synced with selectedOption
  const [activityTab, setActivityTab] = useState<'ai' | 'studio' | 'tasks' | 'inbox'>('ai');
  const [runs, setRuns] = useState<any[]>([]);

  useEffect(() => {
    if (selectedOption === null) {
      setActivityTab('ai');
    } else if (selectedOption === OPTIONS.CODE) {
      setActivityTab('studio');
    } else if (selectedOption === OPTIONS.TASK) {
      setActivityTab('tasks');
    }
  }, [selectedOption]);

  useEffect(() => {
    const fetchRuns = () => {
      const savedRuns = localStorage.getItem('alti_task_runs');
      if (savedRuns) {
        setRuns(JSON.parse(savedRuns));
      } else {
        setRuns([]);
      }
    };

    fetchRuns();
    if (activityTab === 'inbox') {
      const interval = setInterval(fetchRuns, 1000);
      return () => clearInterval(interval);
    }
  }, [activityTab]);

  if (!bot) return null;

  const filteredThreads = botThreads.filter((t) => {
    const titleMatch = (t.title || 'Untitled Chat').toLowerCase().includes(searchQuery.toLowerCase());
    if (!titleMatch) return false;

    const lower = (t.title || '').toLowerCase();
    if (selectedOption === null) return lower.includes('search') || lower.includes('google') || lower.includes('web') || !lower.includes('code');
    if (selectedOption === OPTIONS.CODE) return lower.includes('code') || lower.includes('debug') || lower.includes('python') || lower.includes('rust');
    
    return true;
  });

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

  const handleClearRuns = () => {
    localStorage.removeItem('alti_task_runs');
    setRuns([]);
    toast.success('Run history cleared');
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

      {!hideSidebar && (
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto divide-y divide-black/10">
          
          {/* Section 1: Space Configuration */}
          <div className="flex-none flex flex-col p-4 bg-white">
            <div className="flex bg-[#e1e1e1] dark:bg-white/[0.04] p-1 rounded-xl items-center gap-1 border border-black/[0.03] dark:border-white/[0.03] mb-3">
              <button 
                type="button"
                onClick={() => setConfigTab('instructions')} 
                className={cn(
                  "flex-1 text-center py-1.5 text-xs rounded-lg font-semibold transition-all duration-200 focus:outline-none",
                  configTab === 'instructions' 
                    ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm" 
                    : "text-gray-500 hover:text-gray-800"
                )}
              >
                Instructions
              </button>
              <button 
                type="button"
                onClick={() => setConfigTab('guardrails')} 
                className={cn(
                  "flex-1 text-center py-1.5 text-xs rounded-lg font-semibold transition-all duration-200 focus:outline-none",
                  configTab === 'guardrails' 
                    ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm" 
                    : "text-gray-500 hover:text-gray-800"
                )}
              >
                Guardrails
              </button>
              <button 
                type="button"
                onClick={() => setConfigTab('data')} 
                className={cn(
                  "flex-1 text-center py-1.5 text-xs rounded-lg font-semibold transition-all duration-200 focus:outline-none",
                  configTab === 'data' 
                    ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm" 
                    : "text-gray-500 hover:text-gray-800"
                )}
              >
                Data
              </button>
            </div>

            <div className="max-h-[160px] overflow-y-auto pr-1">
              {configTab === 'instructions' && (
                <div className="space-y-1 animate-in fade-in zoom-in-95 duration-200">
                  {parsedInstructions.length === 0 ? (
                    <div className="py-2 text-center text-xs text-gray-400">
                      No instructions added yet.
                    </div>
                  ) : (
                    parsedInstructions.map((inst, index) => (
                      <div
                        key={index}
                        className="group flex h-8 w-full items-center justify-between rounded-md text-xs font-normal text-black text-left transition-all hover:bg-black/5"
                      >
                        <span className="flex-1 truncate px-1 py-1">
                          {inst.length > 30 ? inst.slice(0, 30) + '...' : inst}
                        </span>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 p-1 rounded-md transition-all flex-none mr-1"
                              title="Delete Instruction"
                            >
                              <Trash2 className="size-3 text-black" />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[400px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
                            <div className="p-5 text-center">
                              <h2 className="text-base font-semibold text-black dark:text-white leading-tight">Delete Instruction</h2>
                              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 leading-normal">
                                Are you sure you want to remove this instruction?
                              </p>
                            </div>
                            <div className="border-t border-black/10 dark:border-white/10 flex h-11">
                              <DialogClose asChild>
                                <button className="flex-1 text-sm font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 h-full border-r border-black/10 dark:border-white/10 outline-none">Cancel</button>
                              </DialogClose>
                              <DialogClose asChild>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newList = parsedInstructions.filter((_, i) => i !== index);
                                    editBot(botId, { instructions: newList.join('\n\n') });
                                  }}
                                  className="flex-1 text-sm font-medium text-red-500 hover:bg-black/5 dark:hover:bg-white/5 h-full outline-none"
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

              {configTab === 'guardrails' && (
                <div className="space-y-1 animate-in fade-in zoom-in-95 duration-200">
                  {parsedGuardrails.length === 0 ? (
                    <div className="py-2 text-center text-xs text-gray-400">
                      No guardrails added yet.
                    </div>
                  ) : (
                    parsedGuardrails.map((guard, index) => (
                      <div
                        key={index}
                        className="group flex h-8 w-full items-center justify-between rounded-md text-xs font-normal text-black text-left transition-all hover:bg-black/5"
                      >
                        <span className="flex-1 truncate px-1 py-1">
                          {guard.length > 30 ? guard.slice(0, 30) + '...' : guard}
                        </span>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 p-1 rounded-md transition-all flex-none mr-1"
                              title="Delete Guardrail"
                            >
                              <Trash2 className="size-3 text-black" />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[400px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
                            <div className="p-5 text-center">
                              <h2 className="text-base font-semibold text-black dark:text-white leading-tight">Delete Guardrail</h2>
                              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 leading-normal">
                                Are you sure you want to remove this constraint?
                              </p>
                            </div>
                            <div className="border-t border-black/10 dark:border-white/10 flex h-11">
                              <DialogClose asChild>
                                <button className="flex-1 text-sm font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 h-full border-r border-black/10 dark:border-white/10 outline-none">Cancel</button>
                              </DialogClose>
                              <DialogClose asChild>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newList = parsedGuardrails.filter((_, i) => i !== index);
                                    editBot(botId, { guardrails: newList.join('\n\n') });
                                  }}
                                  className="flex-1 text-sm font-medium text-red-500 hover:bg-black/5 dark:hover:bg-white/5 h-full outline-none"
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

              {configTab === 'data' && (
                <div className="space-y-1 animate-in fade-in zoom-in-95 duration-200">
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
                          <div className="py-2 text-center text-xs text-gray-400">
                            No data connected.
                          </div>
                        );
                      }

                      return files.map((file, idx) => {
                        const IconComponent = getFileIconComponent(file.name);
                        return (
                          <div key={idx} className="group flex h-8 w-full items-center justify-between rounded-md text-xs font-normal text-black text-left transition-all hover:bg-black/5">
                            <div className="flex items-center flex-1 min-w-0 px-1 py-1">
                              <IconComponent className="size-3 mr-1.5 flex-shrink-0 text-blue-600 opacity-70" />
                              <span className="truncate">{file.name}</span>
                            </div>
                          
                            <Dialog>
                              <DialogTrigger asChild>
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 p-1 rounded-md transition-all flex-none mr-1"
                                  title="Disconnect Data"
                                >
                                  <Trash2 className="size-3 text-black" />
                                </button>
                              </DialogTrigger>
                              <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[400px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
                                <div className="p-5 text-center">
                                  <h2 className="text-base font-semibold text-black dark:text-white leading-tight">Disconnect Data</h2>
                                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 leading-normal">
                                    Are you sure you want to remove this data file?
                                  </p>
                                </div>
                                <div className="border-t border-black/10 dark:border-white/10 flex h-11">
                                  <DialogClose asChild>
                                    <button className="flex-1 text-sm font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 h-full border-r border-black/10 dark:border-white/10 outline-none">Cancel</button>
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
                                      className="flex-1 text-sm font-medium text-red-500 hover:bg-black/5 dark:hover:bg-white/5 h-full outline-none"
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
                    <div className="py-2 text-center text-xs text-gray-400">
                      No data connected.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Workspace & Activity */}
          <div className="flex-1 flex flex-col p-4 bg-white min-h-0">
            
            <div className="flex bg-[#e1e1e1] dark:bg-white/[0.04] p-1 rounded-xl items-center gap-1 border border-black/[0.03] dark:border-white/[0.03] mb-3 shrink-0">
              <button 
                type="button"
                onClick={() => {
                  setSelectedOption(null);
                  setActivityTab('ai');
                }} 
                className={cn(
                  "flex-1 text-center py-1.5 text-xs rounded-lg font-semibold transition-all duration-200 focus:outline-none",
                  (activityTab === 'ai' && selectedOption === null)
                    ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                )}
              >
                AI
              </button>
              <button 
                type="button"
                onClick={() => {
                  setSelectedOption(OPTIONS.CODE);
                  setActivityTab('studio');
                }} 
                className={cn(
                  "flex-1 text-center py-1.5 text-xs rounded-lg font-semibold transition-all duration-200 focus:outline-none",
                  (activityTab === 'studio' && selectedOption === OPTIONS.CODE)
                    ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                )}
              >
                Studio
              </button>
              <button 
                type="button"
                onClick={() => {
                  setSelectedOption(OPTIONS.TASK);
                  setActivityTab('tasks');
                }} 
                className={cn(
                  "flex-1 text-center py-1.5 text-xs rounded-lg font-semibold transition-all duration-200 focus:outline-none",
                  (activityTab === 'tasks' && selectedOption === OPTIONS.TASK)
                    ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                )}
              >
                Tasks
              </button>
              <button 
                type="button"
                onClick={() => setActivityTab('inbox')} 
                className={cn(
                  "flex-1 text-center py-1.5 text-xs rounded-lg font-semibold transition-all duration-200 focus:outline-none",
                  activityTab === 'inbox'
                    ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                )}
              >
                Inbox
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 pr-1">
              {activityTab === 'inbox' ? (
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between shrink-0">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider select-none">Execution Logs</span>
                    {runs.length > 0 && (
                      <button 
                        onClick={handleClearRuns} 
                        className="text-[10px] text-zinc-400 hover:text-red-500 transition-colors font-medium"
                      >
                        Clear History
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {runs.length === 0 ? (
                      <div className="py-8 text-center text-xs text-gray-400">
                        No executions yet. Run a task to see logs.
                      </div>
                    ) : (
                      runs.map((run) => (
                        <div 
                          key={run.id}
                          className="bg-[#e1e1e1]/50 dark:bg-zinc-800/40 rounded-xl p-3 space-y-1.5 border border-black/[0.03] dark:border-white/[0.03]"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-gray-950 dark:text-white text-[11px] truncate max-w-[120px]">
                              {run.taskName}
                            </span>
                            <span className={cn(
                              "text-[9px] font-bold px-1.5 py-0.5 rounded-md border select-none shrink-0",
                              run.status === 'running' && "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 animate-pulse",
                              run.status === 'success' && "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
                              run.status === 'failed' && "bg-rose-500/10 text-rose-600 dark:text-rose-455 border-rose-500/20"
                            )}>
                              {run.status === 'running' ? 'Running' : run.status === 'success' ? 'Success' : 'Failed'}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-600 dark:text-zinc-400 leading-normal line-clamp-3">
                            {run.summary}
                          </p>
                          <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5 text-[9px] text-gray-400">
                            <span>{new Date(run.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {run.duration && <span>{Math.round(run.duration / 100) / 10}s</span>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : activityTab === 'tasks' ? (
                <div className="py-8 text-center text-xs text-gray-400 select-none">
                  Describe automation tasks in the prompt box to trigger runs.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 shrink-0">
                    <div className="flex h-8 flex-1 items-center gap-2 rounded-lg border border-black/10 bg-[#e1e1e1] px-3 shadow-xs transition-all focus-within:ring-1 focus-within:ring-black/20">
                      <Search className="size-3.5 flex-none text-black" />
                      <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent text-xs text-black outline-none placeholder:text-gray-500"
                      />
                    </div>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-[#e1e1e1] text-black shadow-xs transition-all hover:bg-black/[0.03] hover:text-black flex-none dark:bg-zinc-800/50 dark:text-white"
                          onClick={handleNewChat}
                        >
                          <Plus className="size-4 text-black dark:text-white" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>{activityTab === 'studio' ? 'New Code' : 'New Search'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="space-y-1">
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
                              className="flex-1 cursor-pointer truncate px-2 py-2"
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
                              <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[400px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
                                <div className="p-5 text-center">
                                  <h2 className="text-base font-semibold text-black dark:text-white leading-tight">Delete Thread</h2>
                                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 leading-normal">
                                    Are you sure you want to delete this thread?
                                  </p>
                                </div>
                                <div className="border-t border-black/10 dark:border-white/10 flex h-11">
                                  <DialogClose asChild>
                                    <button className="flex-1 text-sm font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 h-full border-r border-black/10 dark:border-white/10 outline-none">Cancel</button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <button 
                                      onClick={(e) => handleThreadDelete(e, thread.id)}
                                      className="flex-1 text-sm font-medium text-red-500 hover:bg-black/5 dark:hover:bg-white/5 h-full outline-none"
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
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </aside>
  );
}
