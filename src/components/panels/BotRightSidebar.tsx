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
  Palette,
  Inbox,
  SlidersHorizontal,
  PenTool,
  ClipboardCheck,
  Image as ImageIcon,
  Video as VideoIcon,
  Music
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
  const basePath = pathname?.startsWith('/admin') ? '/admin/projects' : '/spaces';
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

  const getThreadIcon = (threadTitle: string, tab: TabType) => {
    const lower = (threadTitle || '').toLowerCase();
    
    if (tab === 'ai') {
      if (lower.includes('search') || lower.includes('google') || lower.includes('web') || lower.includes('research') || lower.includes('find') || lower.includes('query')) {
        return Search;
      }
      if (lower.includes('write') || lower.includes('draft') || lower.includes('email') || lower.includes('article') || lower.includes('copy') || lower.includes('text') || lower.includes('essay')) {
        return PenTool;
      }
      if (lower.includes('review') || lower.includes('contract') || lower.includes('check') || lower.includes('audit') || lower.includes('guardrail')) {
        return ClipboardCheck;
      }
      return MessageSquare; // Default for Chat
    }

    if (tab === 'studio') {
      if (lower.includes('image') || lower.includes('art') || lower.includes('draw') || lower.includes('logo') || lower.includes('paint') || lower.includes('picture') || lower.includes('photo') || lower.includes('canvas')) {
        return ImageIcon;
      }
      if (lower.includes('video') || lower.includes('movie') || lower.includes('clip') || lower.includes('animate') || lower.includes('mp4')) {
        return VideoIcon;
      }
      if (lower.includes('audio') || lower.includes('voice') || lower.includes('music') || lower.includes('sound') || lower.includes('transcribe') || lower.includes('speech') || lower.includes('mp3')) {
        return Music;
      }
      return Code; // Default for Code
    }

    return MessageSquare;
  };

  // Filter threads for history tabs
  const filteredThreads = botThreads.filter((t) => {
    const titleMatch = (t.title || 'Untitled Chat').toLowerCase().includes(searchQuery.toLowerCase());
    if (!titleMatch) return false;

    const lower = (t.title || '').toLowerCase();
    const isStudioThread = (
      lower.includes('code') ||
      lower.includes('debug') ||
      lower.includes('python') ||
      lower.includes('rust') ||
      lower.includes('js') ||
      lower.includes('ts') ||
      lower.includes('html') ||
      lower.includes('css') ||
      lower.includes('image') ||
      lower.includes('art') ||
      lower.includes('draw') ||
      lower.includes('logo') ||
      lower.includes('paint') ||
      lower.includes('picture') ||
      lower.includes('photo') ||
      lower.includes('canvas') ||
      lower.includes('video') ||
      lower.includes('movie') ||
      lower.includes('clip') ||
      lower.includes('animate') ||
      lower.includes('mp4') ||
      lower.includes('audio') ||
      lower.includes('voice') ||
      lower.includes('music') ||
      lower.includes('sound') ||
      lower.includes('transcribe') ||
      lower.includes('speech') ||
      lower.includes('mp3')
    );

    if (activeTab === 'ai') return !isStudioThread;
    if (activeTab === 'studio') return isStudioThread;
    
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
        "flex-none flex flex-col border-l border-black/10 dark:border-zinc-800/50 h-full overflow-hidden transition-all duration-300 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100",
        hideSidebar ? "w-10" : "w-76"
      )}
    >
      {hideSidebar ? (
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/10 dark:border-zinc-800/50 pt-4 pb-4 flex-none px-0 justify-center bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
          <PanelLeftClose
            className="size-5 cursor-pointer text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-transform duration-300 flex-none scale-x-[-1]"
            onClick={toggleRightSidebar}
          />
        </header>
      ) : (
        <>
          {/* Header matching left side menu */}
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/10 dark:border-zinc-800/50 pt-4 pb-4 flex-none px-4 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
            <PanelLeftClose
              className="size-5 cursor-pointer text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-transform duration-300 flex-none scale-x-[-1]"
              onClick={toggleRightSidebar}
            />
            <span className="text-sm font-normal truncate max-w-[180px] text-zinc-800 dark:text-white">
              {bot.name}
            </span>
          </header>

          <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-zinc-950">
            {/* 6-Row Toggles stack */}
            <div className="pt-3 px-4 flex-none bg-white dark:bg-zinc-950 transition-colors duration-300">
              <div className="space-y-1.5 w-full">
                {/* Assistant */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOption(null);
                    setActiveTab('ai');
                  }}
                  className={cn(
                    'group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none',
                    activeTab === 'ai' && selectedOption !== OPTIONS.INBOX
                      ? 'bg-[#e1e1e1] border-black/10 text-black dark:bg-white/12 dark:border-white/10 dark:text-white font-semibold shadow-xs'
                      : 'bg-black/[0.02] border-black/5 text-zinc-700 hover:bg-black/[0.04] hover:text-black dark:bg-white/[0.06] dark:border-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.10] dark:hover:text-white',
                  )}
                >
                  <Sparkles className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Assistant</span>
                </button>

                {/* Studio */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOption(OPTIONS.CODE);
                    setActiveTab('studio');
                  }}
                  className={cn(
                    'group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none',
                    activeTab === 'studio' && selectedOption !== OPTIONS.INBOX
                      ? 'bg-[#e1e1e1] border-black/10 text-black dark:bg-white/12 dark:border-white/10 dark:text-white font-semibold shadow-xs'
                      : 'bg-black/[0.02] border-black/5 text-zinc-700 hover:bg-black/[0.04] hover:text-black dark:bg-white/[0.06] dark:border-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.10] dark:hover:text-white',
                  )}
                >
                  <Palette className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Studio</span>
                </button>

                {/* Tasks */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOption(OPTIONS.TASK);
                    setActiveTab('tasks');
                  }}
                  className={cn(
                    'group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none',
                    activeTab === 'tasks' && selectedOption !== OPTIONS.INBOX
                      ? 'bg-[#e1e1e1] border-black/10 text-black dark:bg-white/12 dark:border-white/10 dark:text-white font-semibold shadow-xs'
                      : 'bg-black/[0.02] border-black/5 text-zinc-700 hover:bg-black/[0.04] hover:text-black dark:bg-white/[0.06] dark:border-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.10] dark:hover:text-white',
                  )}
                >
                  <ListTodo className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Tasks</span>
                </button>

                {/* Instructions */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOption(OPTIONS.INSTRUCTIONS);
                    setActiveTab('instructions');
                  }}
                  className={cn(
                    'group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none',
                    activeTab === 'instructions' && selectedOption !== OPTIONS.INBOX
                      ? 'bg-[#e1e1e1] border-black/10 text-black dark:bg-white/12 dark:border-white/10 dark:text-white font-semibold shadow-xs'
                      : 'bg-black/[0.02] border-black/5 text-zinc-700 hover:bg-black/[0.04] hover:text-black dark:bg-white/[0.06] dark:border-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.10] dark:hover:text-white',
                  )}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Instructions</span>
                </button>

                {/* Guardrails */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOption(OPTIONS.GUARDRAILS);
                    setActiveTab('guardrails');
                  }}
                  className={cn(
                    'group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none',
                    activeTab === 'guardrails' && selectedOption !== OPTIONS.INBOX
                      ? 'bg-[#e1e1e1] border-black/10 text-black dark:bg-white/12 dark:border-white/10 dark:text-white font-semibold shadow-xs'
                      : 'bg-black/[0.02] border-black/5 text-zinc-700 hover:bg-black/[0.04] hover:text-black dark:bg-white/[0.06] dark:border-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.10] dark:hover:text-white',
                  )}
                >
                  <Shield className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Guardrails</span>
                </button>

                {/* Knowledge */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOption(OPTIONS.KNOWLEDGE);
                    setActiveTab('knowledge');
                  }}
                  className={cn(
                    'group flex h-9 w-full items-center gap-2.5 px-3 rounded-lg text-xs transition-all duration-150 border cursor-pointer select-none text-left focus:outline-none',
                    activeTab === 'knowledge' && selectedOption !== OPTIONS.INBOX
                      ? 'bg-[#e1e1e1] border-black/10 text-black dark:bg-white/12 dark:border-white/10 dark:text-white font-semibold shadow-xs'
                      : 'bg-black/[0.02] border-black/5 text-zinc-700 hover:bg-black/[0.04] hover:text-black dark:bg-white/[0.06] dark:border-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.10] dark:hover:text-white',
                  )}
                >
                  <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Knowledge</span>
                </button>
              </div>
            </div>

            {/* Enclosed Search & Actions Row */}
            <div className="pt-1.5 pb-1.5 flex items-center px-4 bg-white dark:bg-zinc-950 transition-all duration-300 flex-none w-full">
              <div className="flex h-9 w-full items-center rounded-lg border border-black/5 dark:border-white/[0.04] bg-black/[0.02] dark:bg-white/[0.06] shadow-xs overflow-hidden transition-all duration-150">
                {/* Search segment */}
                <div className="flex flex-1 items-center gap-2.5 px-3 h-full">
                  <Search className="size-3.5 flex-none text-zinc-700 dark:text-white" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs font-normal font-sans text-zinc-850 dark:text-white outline-none placeholder:text-zinc-450 dark:placeholder:text-white/60"
                  />
                </div>

                {/* Vertical Separator */}
                <div className="w-px h-4 bg-transparent dark:bg-white/10 flex-none" />

                {/* Inbox segment */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex h-full w-9 items-center justify-center transition-all hover:bg-black/[0.06] dark:hover:bg-white/[0.06] text-zinc-700 dark:text-white focus:outline-none",
                        selectedOption === OPTIONS.INBOX && "bg-black/[0.08] dark:bg-white/[0.08]"
                      )}
                      onClick={() => {
                        if (selectedOption === OPTIONS.INBOX) {
                          setSelectedOption(null);
                          setActiveTab('ai');
                        } else {
                          setSelectedOption(OPTIONS.INBOX);
                        }
                      }}
                    >
                      <Inbox className="size-3.5 text-zinc-700 dark:text-white" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="rounded-lg bg-zinc-950/95 border border-white/10 text-white text-xs font-semibold px-3 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.5)] border-b-2 border-b-indigo-500 select-none">
                    Inbox
                  </TooltipContent>
                </Tooltip>

                {/* Vertical Separator (only if plus is visible) */}
                {selectedOption !== OPTIONS.INBOX && (
                  <div className="w-px h-4 bg-transparent dark:bg-white/10 flex-none" />
                )}

                {/* Plus segment */}
                {selectedOption !== OPTIONS.INBOX && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="flex h-full w-9 items-center justify-center transition-all hover:bg-black/[0.06] dark:hover:bg-white/[0.06] text-zinc-700 dark:text-white focus:outline-none"
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
                        <Plus className="size-3.5 text-zinc-700 dark:text-white" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="rounded-lg bg-zinc-950/95 border border-white/10 text-white text-xs font-semibold px-3 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.5)] border-b-2 border-b-indigo-500 select-none">
                      {activeTab === 'instructions' 
                        ? 'Add Instruction' 
                        : activeTab === 'guardrails' 
                        ? 'Add Guardrail' 
                        : activeTab === 'knowledge' 
                        ? 'Upload File' 
                        : activeTab === 'studio' 
                        ? 'New Code' 
                        : 'New Chat'}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>

            {/* Scrollable List Container */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 min-h-0">
              {selectedOption === OPTIONS.INBOX ? (
                <div className="space-y-1.5 pb-4 animate-in fade-in duration-200">
                  {runs.length > 0 && (
                    <div className="flex justify-end mb-1.5 shrink-0">
                      <button 
                        onClick={handleClearRuns} 
                        className="text-[10px] text-zinc-400 hover:text-red-400 transition-colors font-medium select-none"
                      >
                        Clear History
                      </button>
                    </div>
                  )}
                  {filteredRuns.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-500 select-none">
                      {searchQuery ? 'No matching executions.' : 'No executions yet.'}
                    </div>
                  ) : (
                    filteredRuns.map((run) => (
                      <div 
                        key={run.id}
                        className="w-full bg-black/[0.02] border border-black/5 text-zinc-800 dark:bg-white/[0.06] dark:border-white/[0.04] dark:text-zinc-300 rounded-lg p-3 space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold text-zinc-900 dark:text-white text-xs truncate">
                            {run.taskName}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-normal">
                          {run.summary}
                        </p>
                        <div className="flex items-center justify-between pt-1.5 border-t border-white/5 text-[9px] text-zinc-500">
                          <span>{new Date(run.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                          {run.duration && <span>{Math.round(run.duration / 100) / 10}s</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : activeTab === 'instructions' ? (
                <div className="space-y-1.5 pb-4 animate-in fade-in duration-200">

                  {filteredInstructions.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-500">
                      {searchQuery ? 'No matching instructions.' : 'No instructions yet.'}
                    </div>
                  ) : (
                    filteredInstructions.map((inst, index) => (
                      <div 
                        key={index}
                        className="group relative bg-black/[0.02] border border-black/5 text-zinc-800 dark:bg-white/[0.06] dark:border-white/[0.04] dark:text-zinc-300 rounded-lg p-3 pr-8"
                      >
                        <p className="text-xs text-zinc-800 dark:text-zinc-300 truncate">
                          {inst}
                        </p>
                        <button
                          onClick={() => {
                            const newList = parsedInstructions.filter((_, i) => i !== index);
                            editBot(botId, { instructions: newList.join('\n\n') });
                            toast.success('Instruction deleted');
                          }}
                          className="absolute right-2 top-2 p-1 rounded-md text-zinc-400 hover:text-red-400 hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-150"
                          title="Delete Instruction"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              ) : activeTab === 'guardrails' ? (
                <div className="space-y-1.5 pb-4 animate-in fade-in duration-200">

                  {filteredGuardrails.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-500">
                      {searchQuery ? 'No matching guardrails.' : 'No guardrails defined.'}
                    </div>
                  ) : (
                    filteredGuardrails.map((gr, index) => (
                      <div 
                        key={index}
                        className="group relative bg-black/[0.02] border border-black/5 text-zinc-800 dark:bg-white/[0.06] dark:border-white/[0.04] dark:text-zinc-300 rounded-lg p-3 pr-8"
                      >
                        <p className="text-xs text-zinc-800 dark:text-zinc-300 truncate">
                          {gr}
                        </p>
                        <button
                          onClick={() => {
                            const newList = parsedGuardrails.filter((_, i) => i !== index);
                            editBot(botId, { guardrails: newList.join('\n\n') });
                            toast.success('Guardrail deleted');
                          }}
                          className="absolute right-2 top-2 p-1 rounded-md text-zinc-400 hover:text-red-400 hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-150"
                          title="Delete Guardrail"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              ) : activeTab === 'knowledge' ? (
                <div className="space-y-1.5 pb-4 animate-in fade-in duration-200">
                  <input
                    id="sidebar-file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  {isUploading && (
                    <div className="py-2 text-center text-xs text-zinc-450 font-medium">
                      Uploading file...
                    </div>
                  )}
                  {filteredKnowledge.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-500">
                      {searchQuery ? 'No matching files.' : 'No files uploaded yet.'}
                    </div>
                  ) : (
                    filteredKnowledge.map((file, index) => (
                      <div 
                        key={index}
                        className="group relative bg-black/[0.02] border border-black/5 text-zinc-850 dark:bg-white/[0.06] dark:border-white/[0.04] dark:text-zinc-300 rounded-lg p-3 pr-8 flex items-center gap-2.5"
                      >
                        <FileText className="size-3.5 text-zinc-400 flex-none" />
                        <span className="text-xs text-zinc-850 dark:text-white font-medium truncate flex-1 min-w-0">
                          {file.name}
                        </span>
                        {file.size > 0 && (
                          <span className="text-[9px] text-zinc-500 flex-none ml-auto select-none">
                            {Math.round(file.size / 1024)} KB
                          </span>
                        )}
                        <button
                          onClick={() => {
                            const newList = knowledgeFiles.filter((_, i) => file.name ? i !== index : false);
                            editBot(botId, { data: JSON.stringify(newList) });
                            toast.success('File deleted');
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-zinc-400 hover:text-red-400 hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-150"
                          title="Delete File"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              ) : activeTab === 'tasks' ? (
                <div className="py-8 text-center text-xs text-zinc-500 select-none animate-in fade-in duration-200">
                  Describe automation tasks in the prompt box to trigger runs.
                </div>
              ) : (
                <div className="space-y-1.5 pb-4 animate-in fade-in duration-200">
                  {filteredThreads.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-500">
                      {searchQuery ? 'No matching chats.' : 'No conversations yet.'}
                    </div>
                  ) : (
                    filteredThreads.map((thread) => {
                      const isSelected = activeThreadId === thread.id;
                      const ThreadIcon = getThreadIcon(thread.title, activeTab);
                      return (
                        <div
                          key={thread.id}
                          className={cn(
                            "group flex h-9 w-full items-center justify-between rounded-lg text-xs font-normal text-left transition-all duration-150 border cursor-pointer select-none",
                            isSelected 
                              ? "bg-[#e1e1e1] border-black/10 text-black font-semibold shadow-xs dark:bg-white/12 dark:border-white/10 dark:text-white" 
                              : "bg-black/[0.02] border-black/5 text-zinc-700 hover:bg-black/[0.04] hover:text-black dark:bg-white/[0.06] dark:border-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.10] dark:hover:text-white",
                          )}
                        >
                          <span
                            className="flex-1 cursor-pointer truncate px-3 py-2 flex items-center gap-2.5"
                            onClick={() => handleThreadSelect(thread.id)}
                          >
                            <ThreadIcon className={cn(
                              "size-3.5 flex-shrink-0 transition-colors",
                              isSelected ? "text-black dark:text-white" : "text-zinc-400 group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-100"
                            )} />
                            <span className="truncate">{thread.title || 'Untitled Chat'}</span>
                          </span>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <button
                                onClick={(e) => e.stopPropagation()}
                                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-black/5 hover:text-red-500 dark:hover:bg-white/5 dark:hover:text-red-400 p-1.5 rounded-md transition-all flex-none mr-1"
                                title="Delete Thread"
                              >
                                <Trash2 className="size-3.5 text-current" />
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
        </>
      )}

      {/* Dialog for adding instruction */}
      <Dialog open={isAddInstructionOpen} onOpenChange={setIsAddInstructionOpen}>
        <DialogContent className="p-6 bg-white dark:bg-zinc-900 border-none rounded-[20px] max-w-[400px] shadow-xl [&>button]:hidden">
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-black dark:text-white">Add Instruction</h3>
            <textarea
              className="w-full h-24 p-3 bg-gray-50 dark:bg-zinc-950 border border-black/15 dark:border-zinc-800 rounded-xl text-xs resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
              className="w-full h-24 p-3 bg-gray-50 dark:bg-zinc-950 border border-black/15 dark:border-zinc-800 rounded-xl text-xs resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
