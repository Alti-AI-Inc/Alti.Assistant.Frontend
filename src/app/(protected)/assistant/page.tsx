'use client';

import { useEffect, Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import FullConversation from '@/app/(protected)/c/[id]/_components/FullConversation';
import LeftSideNav from '@/components/LeftSideNav';
import { cn } from '@/lib/utils';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useBotsStore } from '@/stores/useBotsStore';
import { apiClientJson, buildApiUrl } from '@/lib/api-client';

import { Cpu, Sparkles, Brain, Shield, Terminal, Zap, Activity, CheckCircle2, ChevronRight, Server } from 'lucide-react';

interface TelemetryLog {
  timestamp: string;
  module: 'OPENCLAW' | 'HERMES' | 'SYSTEM' | 'SYNAPSE';
  message: string;
  type: 'info' | 'success' | 'warn';
}

function AssistantWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  
  const { setActiveConversation, activeConversation } = useConversationsStore();
  const { isRightSidebarOpen } = useSidebarStore();
  const { setActiveBotId } = useBotsStore();

  // Read conversation ID from search parameter 'c'
  const convIdParam = searchParams?.get('c');
  const activeConversationId = convIdParam || 'new-chat';

  // Synchronize state
  useEffect(() => {
    setActiveBotId(null); // Not a custom agent persona, this is the master assistant
    if (!convIdParam) {
      setActiveConversation(null);
    }
  }, [convIdParam, setActiveBotId, setActiveConversation]);

  // Telemetry logs simulation
  const [logs, setLogs] = useState<TelemetryLog[]>([
    { timestamp: '13:35:01', module: 'SYSTEM', message: 'Alti Master Assistant initialized successfully.', type: 'success' },
    { timestamp: '13:35:03', module: 'OPENCLAW', message: 'Composio App Gateway loaded (500+ tools verified).', type: 'info' },
    { timestamp: '13:35:04', module: 'HERMES', message: 'Cognitive self-reflection cycles: Online.', type: 'info' },
    { timestamp: '13:35:05', module: 'SYNAPSE', message: 'Vector database memory structures integrated.', type: 'success' },
  ]);

  // Add a simulation log every 10 seconds
  useEffect(() => {
    const modules: ('OPENCLAW' | 'HERMES' | 'SYNAPSE')[] = ['OPENCLAW', 'HERMES', 'SYNAPSE'];
    const messages = {
      OPENCLAW: [
        'Checked active third-party connection states.',
        'Validated OAuth callbacks for secure workspaces.',
        'Indexed function schemas into Tool Router.',
        'MCP tool registry refresh complete.',
      ],
      HERMES: [
        'Consolidated short-term reasoning buffers.',
        'Refined prompt grounding weights.',
        'Self-reflection pipeline: 0.1s latency check passed.',
        'Pruning memory graphs for optimal query bounds.',
      ],
      SYNAPSE: [
        'Intent classifier running in Flash deterministic mode.',
        'Parsing conversation history tokens.',
        'Re-ranking search contexts for enhanced groundings.',
      ],
    };

    const interval = setInterval(() => {
      const selectedModule = modules[Math.floor(Math.random() * modules.length)];
      const phraseList = messages[selectedModule];
      const selectedMsg = phraseList[Math.floor(Math.random() * phraseList.length)];
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      setLogs((prev) => [
        ...prev.slice(-15), // keep last 15 logs
        { timestamp: timeStr, module: selectedModule, message: selectedMsg, type: 'info' },
      ]);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FCFCFC] dark:bg-gray-950 relative">
      {/* Background blobs for premium glassmorphism */}
      <div className="absolute -top-40 right-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Middle Interactive Workspace */}
      <div className="flex flex-1 flex-col items-center justify-center relative overflow-y-auto h-full px-4 md:px-8 z-10">
        {!activeConversation?.messages?.length && (
          <h1 className="mb-8 text-4xl font-medium tracking-tight text-gray-900 dark:text-white flex items-center gap-2.5">
            <Sparkles className="h-9 w-9 text-indigo-500 animate-pulse" />
            Alti Assistant
          </h1>
        )}

        {/* Chat Component */}
        <div className="flex-1 w-full overflow-hidden flex flex-col justify-center">
          <FullConversation conversationId={activeConversationId} />
        </div>
      </div>

      {/* Right Telemetry Pane - Desktop only */}
      <div
        className={cn(
          'sticky top-0 right-0 hidden h-screen flex-col border-l border-black/5 dark:border-zinc-800/80 transition-all duration-300 ease-in-out lg:flex bg-[#F8F9FA] dark:bg-zinc-900 z-20',
          isRightSidebarOpen ? 'w-80' : 'w-0 overflow-hidden border-l-0',
        )}
      >
        <div className="flex-1 flex flex-col overflow-hidden p-5 space-y-6">
          
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-black/5 dark:border-zinc-800 pb-4">
            <Activity className="h-5 w-5 text-indigo-500 animate-pulse" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-zinc-200">
                Cognitive Telemetry
              </h3>
              <p className="text-[10px] text-gray-500">Live Agent Pipeline Metrics</p>
            </div>
          </div>

          {/* Core Engines Status */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Agent Architectures</h4>
            
            <div className="space-y-2">
              {/* OpenClaw Status Box */}
              <div className="rounded-xl border border-black/5 bg-white/50 dark:bg-zinc-800/50 p-3 flex items-start gap-2.5 backdrop-blur-xs">
                <Server className="h-4 w-4 text-emerald-500 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">OpenClaw</span>
                    <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm dark:bg-emerald-950/30 dark:text-emerald-400">ACTIVE</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Handles 500+ third-party tools, API pipelines, and secure executions.</p>
                </div>
              </div>

              {/* Hermes Status Box */}
              <div className="rounded-xl border border-black/5 bg-white/50 dark:bg-zinc-800/50 p-3 flex items-start gap-2.5 backdrop-blur-xs">
                <Brain className="h-4 w-4 text-indigo-500 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">Hermes</span>
                    <span className="text-[9px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-sm dark:bg-indigo-950/30 dark:text-indigo-400">ONLINE</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Orchestrates vector memories, self-reflection cycles, and step-reasoning.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Capabilities */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-bold">Capabilities In-Use</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-600 dark:text-zinc-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Memory System</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-600 dark:text-zinc-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Tool Approvals</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-600 dark:text-zinc-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Cron Scheduler</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-600 dark:text-zinc-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Self-Reflection</span>
              </div>
            </div>
          </div>

          {/* Telemetry Trace Log */}
          <div className="flex-1 flex flex-col min-h-0 space-y-2.5">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-zinc-800 pb-1.5">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Live Trace Log</h4>
              <span className="animate-ping h-1.5 w-1.5 rounded-full bg-indigo-500" />
            </div>

            {/* Trace Panel */}
            <div className="flex-1 overflow-y-auto bg-black/5 dark:bg-black/30 rounded-xl p-3 border border-black/5 font-mono text-[9px] text-gray-600 dark:text-zinc-400 leading-relaxed space-y-2">
              {logs.map((log, idx) => (
                <div key={idx} className="flex gap-1.5">
                  <span className="text-gray-400 flex-none">[{log.timestamp}]</span>
                  <span className={cn(
                    'font-bold flex-none',
                    log.module === 'OPENCLAW' && 'text-emerald-500',
                    log.module === 'HERMES' && 'text-indigo-500',
                    log.module === 'SYSTEM' && 'text-amber-500',
                    log.module === 'SYNAPSE' && 'text-blue-500',
                  )}>
                    {log.module}:
                  </span>
                  <span className="break-all">{log.message}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function AssistantWorkspace() {
  return (
    <Suspense fallback={
      <div className="flex-1 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500 font-semibold text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          Loading Assistant Workspace...
        </div>
      </div>
    }>
      <AssistantWorkspaceContent />
    </Suspense>
  );
}

export default AssistantWorkspace;
