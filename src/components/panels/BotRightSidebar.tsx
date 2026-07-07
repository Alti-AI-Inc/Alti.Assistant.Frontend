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
  Code,
  ListTodo,
  BookOpen,
  Sparkles,
  Wand2,
  Inbox,
  SlidersHorizontal
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

type TabType = 'ai' | 'studio' | 'tasks' | 'inbox' | 'instructions' | 'guardrails' | 'knowledge';

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
  
  // Single active tab state
  const [activeTab, setActiveTab] = useState<TabType>('ai');
  const [runs, setRuns] = useState<any[]>([]);

  // Dialog States for adding config items
  const [isAddInstructionOpen, setIsAddInstructionOpen] = useState(false);
  const [newInstruction, setNewInstruction] = useState('');
  const [isAddGuardrailOpen, setIsAddGuardrailOpen] = useState(false);
  const [newGuardrail, setNewGuardrail] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Sync activeTab with global selectedOption
  useEffect(() => {
    if (selectedOption === null) {
      if (activeTab !== 'inbox') {
        setActiveTab('ai');
      }
    } else if (selectedOption === OPTIONS.CODE) {
      setActiveTab('studio');
    } else if (selectedOption === OPTIONS.TASK) {
      setActiveTab('tasks');
    } else if (selectedOption === OPTIONS.INSTRUCTIONS) {
      setActiveTab('instructions');
    } else if (selectedOption === OPTIONS.GUARDRAILS) {
      setActiveTab('guardrails');
    } else if (selectedOption === OPTIONS.KNOWLEDGE) {
      setActiveTab('knowledge');
    }
  }, [selectedOption]);

  // Listen to global inbox click events (e.g. from LeftSideNav)
  useEffect(() => {
    const handleInboxClick = () => {
      if (
        selectedOption === OPTIONS.INSTRUCTIONS ||
        selectedOption === OPTIONS.GUARDRAILS ||
        selectedOption === OPTIONS.KNOWLEDGE
      ) {
        setSelectedOption(null);
      }
      setActiveTab('inbox');
    };
    window.addEventListener('alti_inbox_click', handleInboxClick);
    return () => window.removeEventListener('alti_inbox_click', handleInboxClick);
  }, [selectedOption, setSelectedOption]);

  // Fetch runs for Inbox
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
    if (activeTab === 'inbox') {
      const interval = setInterval(fetchRuns, 1000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  if (!bot) return null;

  // Filter threads for history tabs
  const filteredThreads = botThreads.filter((t) => {
    const titleMatch = (t.title || 'Untitled Chat').toLowerCase().includes(searchQuery.toLowerCase());
    if (!titleMatch) return false;

    const lower = (t.title || '').toLowerCase();
    if (activeTab === 'ai') return lower.includes('search') || lower.includes('google') || lower.includes('web') || !lower.includes('code');
    if (activeTab === 'studio') return lower.includes('code') || lower.includes('debug') || lower.includes('python') || lower.includes('rust');
    
    return true;
  });

  const handleNewChat = () => {
    setActiveBotThreadId(null);
    setActiveConversation(null);
    setActiveTab('ai');
    router.push(`${basePath}?bot=${botId}`);
  };

  const handleThreadSelect = (threadId: string) => {
    setActiveBotThreadId(threadId);
    setActiveTab('ai');
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      let filesList: { name: string, size: number }[] = [];
      if (bot.data) {
        try {
          filesList = JSON.parse(bot.data);
        } catch {
          filesList = [{ name: bot.data, size: 0 }];
        }
      }
      
      if (filesList.some(f => f.name === file.name)) {
        toast.error('File already exists in Knowledge');
        return;
      }

      filesList.push({ name: file.name, size: file.size });
      editBot(botId, { data: JSON.stringify(filesList) });
      toast.success(`${file.name} uploaded successfully to Knowledge`);
    }
  };

  const hideSidebar = !isRightSidebarOpen;
  const parsedInstructions = bot.instructions ? bot.instructions.split('\n\n').filter(Boolean) : [];
  const parsedGuardrails = bot.guardrails ? bot.guardrails.split('\n\n').filter(Boolean) : [];

  // Filter instructions based on search query
  const filteredInstructions = parsedInstructions.filter(inst => 
    inst.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter guardrails based on search query
  const filteredGuardrails = parsedGuardrails.filter(guard => 
    guard.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Parse knowledge files
  let knowledgeFiles: { name: string, size: number }[] = [];
  if (bot.data) {
    try {
      knowledgeFiles = JSON.parse(bot.data);
    } catch {
      knowledgeFiles = [{ name: bot.data, size: 0 }];
    }
  }
  const filteredKnowledge = knowledgeFiles.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter runs logs
  const filteredRuns = runs.filter(run => 
    run.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    run.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={cn(
        "flex-none flex flex-col border-l border-black/10 h-full overflow-hidden transition-all duration-300",
        hideSidebar ? "w-10" : "w-76"
      )}
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {hideSidebar ? (
        <header
          className="sticky top-0 z-30 flex items-center justify-between border-b border-black/10 pt-4 pb-4 flex-none px-0 justify-center"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <PanelLeftClose
            className="size-5 cursor-pointer text-gray-600 transition-transform duration-300 flex-none scale-x-[-1]"
            onClick={toggleRightSidebar}
          />
        </header>
      ) : activeTab === 'inbox' ? (
        <div className="flex-1 flex flex-col min-h-0 bg-[#F9FAFB] dark:bg-zinc-950 p-4 space-y-4">
          {/* Floating Search Bar */}
          <div className="relative flex items-center h-12 w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 px-4 shadow-sm focus-within:ring-2 focus-within:ring-black/5 transition-all">
            <Search className="size-4 text-gray-400 mr-2 flex-none" />
            <input
              type="text"
              placeholder="Search Inbox..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-black dark:text-white outline-none placeholder:text-gray-400"
            />
            {/* Close/Back button to return to AI tab */}
            <button
              onClick={() => {
                setSelectedOption(null);
                setActiveTab('ai');
              }}
              className="ml-2 p-1.5 rounded-lg text-gray-400 hover:bg-black/5 hover:text-black dark:hover:bg-white/5 dark:hover:text-white transition-colors flex-none"
              title="Exit Inbox"
            >
              <PanelLeftClose className="size-4" />
            </button>
          </div>

          {/* Execution Logs Header / Clear History */}
          <div className="flex items-center justify-between px-1 flex-none">
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

          {/* Inbox List Area */}
          <div className="flex-1 overflow-y-auto space-y-3 min-h-0 pr-1 pb-4">
            {filteredRuns.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400 select-none">
                {searchQuery ? 'No matching executions.' : 'No executions yet. Run a task to see logs.'}
              </div>
            ) : (
              filteredRuns.map((run) => (
                <div 
                  key={run.id}
                  className="w-full bg-white dark:bg-zinc-900 rounded-xl p-4 space-y-2 border border-black/[0.06] dark:border-white/[0.06] shadow-xs hover:shadow-sm transition-shadow duration-150"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-gray-955 dark:text-white text-xs truncate">
                      {run.taskName}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                    {run.summary}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 text-[10px] text-gray-400">
                    <span>{new Date(run.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                    {run.duration && <span>{Math.round(run.duration / 100) / 10}s</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <>
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
            <div className="flex-1 flex flex-col min-h-0 bg-white">
              
              {/* Consolidated Single Toggle List (top) */}
              <div className="px-4 pt-4 shrink-0">
                <div className="flex bg-[#e1e1e1] dark:bg-white/[0.04] p-1 rounded-xl items-center gap-1 border border-black/[0.03] dark:border-white/[0.03] flex-wrap justify-between">
                  
                  {/* AI Toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOption(null);
                          setActiveTab('ai');
                        }}
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none",
                          activeTab === 'ai'
                            ? "bg-white border-black/10 text-black shadow-xs dark:bg-zinc-800 dark:border-white/10 dark:text-white"
                            : "bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800"
                        )}
                      >
                        <Sparkles className="size-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>AI</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Studio Toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOption(OPTIONS.CODE);
                          setActiveTab('studio');
                        }}
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none",
                          activeTab === 'studio'
                            ? "bg-white border-black/10 text-black shadow-xs dark:bg-zinc-800 dark:border-white/10 dark:text-white"
                            : "bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800"
                        )}
                      >
                        <Wand2 className="size-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Studio</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Tasks Toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOption(OPTIONS.TASK);
                          setActiveTab('tasks');
                        }}
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none",
                          activeTab === 'tasks'
                            ? "bg-white border-black/10 text-black shadow-xs dark:bg-zinc-800 dark:border-white/10 dark:text-white"
                            : "bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800"
                        )}
                      >
                        <ListTodo className="size-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Tasks</p>
                    </TooltipContent>
                  </Tooltip>


                  {/* Instructions Toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOption(OPTIONS.INSTRUCTIONS);
                          setActiveTab('instructions');
                        }}
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none",
                          activeTab === 'instructions'
                            ? "bg-white border-black/10 text-black shadow-xs dark:bg-zinc-800 dark:border-white/10 dark:text-white"
                            : "bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800"
                        )}
                      >
                        <SlidersHorizontal className="size-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Instructions</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Guardrails Toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOption(OPTIONS.GUARDRAILS);
                          setActiveTab('guardrails');
                        }}
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none",
                          activeTab === 'guardrails'
                            ? "bg-white border-black/10 text-black shadow-xs dark:bg-zinc-800 dark:border-white/10 dark:text-white"
                            : "bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800"
                        )}
                      >
                        <Shield className="size-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Guardrails</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Knowledge Toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOption(OPTIONS.KNOWLEDGE);
                          setActiveTab('knowledge');
                        }}
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none select-none",
                          activeTab === 'knowledge'
                            ? "bg-white border-black/10 text-black shadow-xs dark:bg-zinc-800 dark:border-white/10 dark:text-white"
                            : "bg-transparent border-transparent text-gray-500 hover:bg-black/[0.03] hover:text-gray-800"
                        )}
                      >
                        <BookOpen className="size-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Knowledge</p>
                    </TooltipContent>
                  </Tooltip>

                </div>
              </div>

              {/* Straight line below the toggle */}
              <div className="h-px w-[calc(100%+2rem)] -ml-4 bg-black/10 mt-4 shrink-0" />

              {/* Search & Actions Row below toggle */}
              <div className="flex items-center justify-between gap-2 px-4 pt-4 shrink-0">
                <div className="flex h-8 flex-1 items-center gap-2 rounded-lg border border-black/10 bg-[#e1e1e1] px-3 shadow-xs transition-all focus-within:ring-1 focus-within:ring-black/20">
                  <Search className="size-3.5 flex-none text-black" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs text-black outline-none placeholder:text-gray-500"
                  />
                </div>

                {/* Inbox Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 text-black shadow-xs transition-all flex-none dark:text-white bg-[#e1e1e1] hover:bg-black/[0.03] dark:bg-zinc-800/50"
                      onClick={() => {
                        if (
                          selectedOption === OPTIONS.INSTRUCTIONS ||
                          selectedOption === OPTIONS.GUARDRAILS ||
                          selectedOption === OPTIONS.KNOWLEDGE
                        ) {
                          setSelectedOption(null);
                        }
                        setActiveTab('inbox');
                      }}
                    >
                      <Inbox className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Inbox</p>
                  </TooltipContent>
                </Tooltip>

                {/* Render + button for all tabs EXCEPT Inbox */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-[#e1e1e1] text-black shadow-xs transition-all hover:bg-white/[0.08] hover:text-black flex-none dark:bg-zinc-800/50 dark:text-white"
                      onClick={() => {
                        if (activeTab === 'instructions') {
                          setIsAddInstructionOpen(true);
                        } else if (activeTab === 'guardrails') {
                          setIsAddGuardrailOpen(true);
                        } else if (activeTab === 'knowledge') {
                          document.getElementById('sidebar-file-upload')?.click();
                        } else {
                          handleNewChat();
                        }
                      }}
                    >
                      <Plus className="size-4 text-black dark:text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>
                      {activeTab === 'instructions' 
                        ? 'Add Instruction' 
                        : activeTab === 'guardrails' 
                        ? 'Add Guardrail' 
                        : activeTab === 'knowledge' 
                        ? 'Upload File' 
                        : activeTab === 'studio' 
                        ? 'New Code' 
                        : 'New Search'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Scrollable container for items */}
              <div className="flex-1 overflow-y-auto px-4 pb-4 min-h-0 mt-4">
                
                {activeTab === 'instructions' && (
                  <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between shrink-0">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider select-none">System Prompts</span>
                      <button 
                        onClick={() => setIsAddInstructionOpen(true)} 
                        className="text-[10px] text-zinc-400 hover:text-white transition-colors font-medium"
                      >
                        Add New
                      </button>
                    </div>
                    {parsedInstructions.length === 0 ? (
                      <div className="py-8 text-center text-xs text-gray-400">
                        No instructions yet. Click Add to customize behavior.
                      </div>
                    ) : (
                      parsedInstructions.map((inst, index) => (
                        <div 
                          key={index}
                          className="group relative bg-[#e1e1e1]/50 dark:bg-zinc-800/40 rounded-xl p-3 border border-black/[0.03] dark:border-white/[0.03] pr-8"
                        >
                          <p className="text-xs text-gray-800 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                            {inst}
                          </p>
                          <button
                            onClick={() => {
                              const newList = parsedInstructions.filter((_, i) => i !== index);
                              editBot(botId, { instructions: newList.join('\n\n') });
                              toast.success('Instruction deleted');
                            }}
                            className="absolute right-2 top-2 p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-150"
                            title="Delete Instruction"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'guardrails' && (
                  <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between shrink-0">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider select-none">Safety Rules</span>
                      <button 
                        onClick={() => setIsAddGuardrailOpen(true)} 
                        className="text-[10px] text-zinc-400 hover:text-white transition-colors font-medium"
                      >
                        Add New
                      </button>
                    </div>
                    {parsedGuardrails.length === 0 ? (
                      <div className="py-8 text-center text-xs text-gray-400">
                        No guardrails defined. Add rules to restrict output.
                      </div>
                    ) : (
                      parsedGuardrails.map((gr, index) => (
                        <div 
                          key={index}
                          className="group relative bg-[#e1e1e1]/50 dark:bg-zinc-800/40 rounded-xl p-3 border border-black/[0.03] dark:border-white/[0.03] pr-8"
                        >
                          <p className="text-xs text-gray-800 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                            {gr}
                          </p>
                          <button
                            onClick={() => {
                              const newList = parsedGuardrails.filter((_, i) => i !== index);
                              editBot(botId, { guardrails: newList.join('\n\n') });
                              toast.success('Guardrail deleted');
                            }}
                            className="absolute right-2 top-2 p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-150"
                            title="Delete Guardrail"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'knowledge' && (
                  <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between shrink-0">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider select-none">Uploaded Files</span>
                      <div>
                        <input
                          id="sidebar-file-upload"
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                        />
                        <button 
                          onClick={() => document.getElementById('sidebar-file-upload')?.click()}
                          disabled={isUploading}
                          className="text-[10px] text-zinc-400 hover:text-white transition-colors font-medium disabled:opacity-50"
                        >
                          {isUploading ? 'Uploading...' : 'Upload File'}
                        </button>
                      </div>
                    </div>
                    {filteredKnowledge.length === 0 ? (
                      <div className="py-8 text-center text-xs text-gray-400">
                        {searchQuery ? 'No matching files.' : 'No files uploaded yet. Add files to teach your bot.'}
                      </div>
                    ) : (
                      filteredKnowledge.map((file, index) => {
                        return (
                          <div 
                            key={index}
                            className="group relative bg-[#e1e1e1]/50 dark:bg-zinc-800/40 rounded-xl p-3 border border-black/[0.03] dark:border-white/[0.03] pr-8 flex items-center gap-2"
                          >
                            <FileText className="size-4 text-zinc-400 flex-none" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-850 dark:text-zinc-200 font-medium truncate">
                                {file.name}
                              </p>
                              {file.size > 0 && (
                                <p className="text-[9px] text-gray-400 mt-0.5">
                                  {Math.round(file.size / 1024)} KB
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                const newList = knowledgeFiles.filter((_, i) => file.name ? i !== index : false);
                                editBot(botId, { data: JSON.stringify(newList) });
                                toast.success('File deleted');
                              }}
                              className="absolute right-2 top-2 p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-150"
                              title="Delete File"
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        )
                      })
                    )}
                  </div>
                )}


                {activeTab === 'tasks' && (
                  <div className="py-8 text-center text-xs text-gray-400 select-none animate-in fade-in zoom-in-95 duration-200">
                    Describe automation tasks in the prompt box to trigger runs.
                  </div>
                )}

                {(activeTab === 'ai' || activeTab === 'studio') && (
                  <div className="space-y-1 animate-in fade-in zoom-in-95 duration-200">
                    {filteredThreads.length === 0 ? (
                      <div className="py-8 text-center text-xs text-gray-400">
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
                )}
              </div>

            </div>
          )}
        </>
      )}

      {/* Dialog for adding instruction */}
      <Dialog open={isAddInstructionOpen} onOpenChange={setIsAddInstructionOpen}>
        <DialogContent className="p-6 bg-white dark:bg-zinc-900 border-none rounded-[20px] max-w-[400px] shadow-xl [&>button]:hidden">
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-black dark:text-white">Add Instruction</h3>
            <textarea
              className="w-full h-24 p-3 bg-gray-50 dark:bg-zinc-955 border border-black/15 dark:border-zinc-800 rounded-xl text-xs resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter new instruction..."
              value={newInstruction}
              onChange={(e) => setNewInstruction(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => {
                setIsAddInstructionOpen(false);
                setNewInstruction('');
              }}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => {
                if (newInstruction.trim()) {
                  const newList = [...parsedInstructions, newInstruction.trim()];
                  editBot(botId, { instructions: newList.join('\n\n') });
                  setIsAddInstructionOpen(false);
                  setNewInstruction('');
                  toast.success('Instruction added');
                }
              }}>
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for adding guardrail */}
      <Dialog open={isAddGuardrailOpen} onOpenChange={setIsAddGuardrailOpen}>
        <DialogContent className="p-6 bg-white dark:bg-zinc-900 border-none rounded-[20px] max-w-[400px] shadow-xl [&>button]:hidden">
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-black dark:text-white">Add Guardrail</h3>
            <textarea
              className="w-full h-24 p-3 bg-gray-50 dark:bg-zinc-955 border border-black/15 dark:border-zinc-800 rounded-xl text-xs resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter new guardrail..."
              value={newGuardrail}
              onChange={(e) => setNewGuardrail(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => {
                setIsAddGuardrailOpen(false);
                setNewGuardrail('');
              }}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => {
                if (newGuardrail.trim()) {
                  const newList = [...parsedGuardrails, newGuardrail.trim()];
                  editBot(botId, { guardrails: newList.join('\n\n') });
                  setIsAddGuardrailOpen(false);
                  setNewGuardrail('');
                  toast.success('Guardrail added');
                }
              }}>
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
