'use client';

import { Button } from '@/components/ui/button';
import { useBotsStore } from '@/stores/useBotsStore';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { Plus, Trash2, PanelLeftClose, Search, Brain, Activity, Sparkles, TrendingUp } from 'lucide-react';
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
  
  // Reinforced Learning loop state
  const [rlScore, setRlScore] = useState(98.4);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [adaptivePrompt, setAdaptivePrompt] = useState(true);
  const [patternSynth, setPatternSynth] = useState(true);

  const handleCalibrate = () => {
    if (isCalibrating) return;
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
      setRlScore((prev) => parseFloat((prev + 0.2).toFixed(1)));
    }, 1500);
  };

  const getRLAdjustments = (id: string) => {
    switch (id) {
      case 'python-expert':
        return [
          { text: 'PEP-8 Syntax Precision', diff: '+0.4%' },
          { text: 'Algorithmic Complexity Tuning', diff: '-12ms' },
          { text: 'Docstring Coverage Calibration', diff: 'Optimal' }
        ];
      case 'ui-design-guru':
        return [
          { text: 'Tailwind Palette Syncing', diff: 'Matched' },
          { text: 'Glassmorphism Blur Density', diff: '+1.2px' },
          { text: 'Hover Animation Velocity', diff: 'Balanced' }
        ];
      case 'copywriter':
        return [
          { text: 'Emotional Persuasion Index', diff: '+2.1%' },
          { text: 'Brevity and Cadence Rhythm', diff: 'Perfected' },
          { text: 'SEO Keyword Ingestion', diff: '96.2%' }
        ];
      default:
        return [
          { text: 'Retrieval Accuracy Bias', diff: '+0.5%' },
          { text: 'Conversational Cadence', diff: 'Adaptive' },
          { text: 'Hallucination Safety Margin', diff: 'Strict' }
        ];
    }
  };

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

      {/* Reinforced Learning Loop Panel */}
      {!hideSidebar && (
        <div className="px-4 py-4 border-b border-black/10 flex-none" style={{ backgroundColor: '#F2F3F5' }}>
          <div className="rounded-xl border border-blue-500/10 bg-white/70 dark:bg-zinc-800/40 p-3 shadow-xs backdrop-blur-md relative overflow-hidden">
            {/* Glowing neon decorative background line */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0" />
            
            {/* Title Row */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <Brain className="size-4 text-blue-600 dark:text-blue-500 animate-pulse" />
                <span className="text-xs font-bold text-gray-950 dark:text-zinc-100">Reinforced Learning</span>
              </div>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[9px] font-bold text-emerald-600 tracking-wide uppercase">ACTIVE</span>
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3 bg-black/[0.02] dark:bg-white/[0.01] p-2 rounded-lg border border-black/[0.03]">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-gray-500 dark:text-zinc-400">Alignment Index</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">{rlScore}%</span>
                  <TrendingUp className="size-2.5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-gray-500 dark:text-zinc-400">Evolution Lvl</p>
                <p className="text-xs font-extrabold text-gray-800 dark:text-zinc-300 mt-0.5">Lvl 4 <span className="text-[8px] font-normal text-gray-400">(Adaptive)</span></p>
              </div>
            </div>

            {/* Dynamic adjustments listing */}
            <div className="space-y-1.5 mb-3 border-t border-black/5 pt-2.5">
              <p className="text-[9px] font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide">Self-Correcting Alignments</p>
              <div className="space-y-1">
                {getRLAdjustments(bot.id).map((adj, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px] text-gray-600 dark:text-zinc-400 bg-white/40 dark:bg-zinc-800/10 px-2 py-0.5 rounded border border-black/[0.02]">
                    <span className="truncate pr-2">{adj.text}</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 text-[9px]">{adj.diff}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Control Toggles */}
            <div className="space-y-2 mb-3 border-t border-black/5 pt-2.5">
              <div className="flex items-center justify-between text-[10px] text-gray-700 dark:text-zinc-300">
                <span className="font-semibold">Adaptive Prompt Tuning</span>
                <button 
                  onClick={() => setAdaptivePrompt(!adaptivePrompt)}
                  className={cn(
                    "w-7 h-4 rounded-full p-0.5 transition-colors focus:outline-none flex items-center justify-start",
                    adaptivePrompt ? "bg-blue-600 justify-end" : "bg-gray-300 dark:bg-zinc-700"
                  )}
                >
                  <span className="w-3 h-3 rounded-full bg-white shadow-xs" />
                </button>
              </div>
              <div className="flex items-center justify-between text-[10px] text-gray-700 dark:text-zinc-300">
                <span className="font-semibold">User Pattern Synthesizer</span>
                <button 
                  onClick={() => setPatternSynth(!patternSynth)}
                  className={cn(
                    "w-7 h-4 rounded-full p-0.5 transition-colors focus:outline-none flex items-center justify-start",
                    patternSynth ? "bg-blue-600 justify-end" : "bg-gray-300 dark:bg-zinc-700"
                  )}
                >
                  <span className="w-3 h-3 rounded-full bg-white shadow-xs" />
                </button>
              </div>
            </div>

            {/* Interactive Calibration Trigger Button */}
            <button
              onClick={handleCalibrate}
              disabled={isCalibrating}
              className={cn(
                "w-full h-8 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all duration-200 shadow-xs border",
                isCalibrating 
                  ? "bg-blue-50/50 border-blue-200/50 text-blue-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 border-blue-700 text-white hover:scale-[1.01]"
              )}
            >
              {isCalibrating ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Activity className="size-3 animate-spin" />
                  Calibrating Loop...
                </span>
              ) : (
                "Optimize Feedback Loop"
              )}
            </button>
          </div>
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
