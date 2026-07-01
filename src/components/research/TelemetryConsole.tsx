'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Shield, Sparkles, Loader2, ArrowDownCircle } from 'lucide-react';

interface TelemetryEvent {
  step: string;
  message: string;
  percentage: number;
}

interface TelemetryConsoleProps {
  conversationId: string;
  active: boolean;
  onComplete?: () => void;
}

export default function TelemetryConsole({ conversationId, active, onComplete }: TelemetryConsoleProps) {
  const [percentage, setPercentage] = useState(0);
  const [logs, setLogs] = useState<{ id: string; timestamp: string; step: string; message: string; type: 'info' | 'success' | 'warn' }[]>([
    { id: 'init', timestamp: new Date().toLocaleTimeString(), step: 'system', message: 'Ready to launch deep recursive network crawler...', type: 'info' }
  ]);
  const [currentStep, setCurrentStep] = useState('Standby');
  const [currentMessage, setCurrentMessage] = useState('Awaiting query input from operator...');
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !conversationId) return;

    // Reset state
    setPercentage(0);
    setLogs([
      { id: 'launch', timestamp: new Date().toLocaleTimeString(), step: 'system', message: '🚀 Deep research agent launched successfully.', type: 'info' }
    ]);
    setCurrentStep('Initiating');
    setCurrentMessage('Connecting telemetry pipeline...');

    const base = process.env.NEXT_PUBLIC_API_URL || 'https://www.insoai.com/api/v1';
    const sseUrl = `${base}/deep-research/telemetry?conversationId=${conversationId}`;
    
    console.log('[TelemetryConsole] Connecting to SSE stream:', sseUrl);
    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      try {
        const data: TelemetryEvent = JSON.parse(event.data);
        console.log('[TelemetryConsole] Received event:', data);

        if (data.percentage !== undefined) {
          setPercentage(data.percentage);
        }
        if (data.step) {
          setCurrentStep(data.step);
        }
        if (data.message) {
          setCurrentMessage(data.message);
          
          let logType: 'info' | 'success' | 'warn' = 'info';
          if (data.percentage === 100) logType = 'success';
          if (data.step === 'board_debate') logType = 'warn';

          setLogs(prev => [
            ...prev,
            {
              id: `${Date.now()}-${Math.random()}`,
              timestamp: new Date().toLocaleTimeString(),
              step: data.step,
              message: data.message,
              type: logType
            }
          ]);
        }

        if (data.percentage === 100) {
          eventSource.close();
          if (onComplete) onComplete();
        }
      } catch (err) {
        console.error('[TelemetryConsole] Failed to parse SSE event:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn('[TelemetryConsole] EventSource error, closing connection:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [active, conversationId, onComplete]);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!active) return null;

  return (
    <div className="w-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/20 backdrop-blur-md p-6 font-mono text-zinc-700 dark:text-zinc-300 shadow-xl relative overflow-hidden my-4 min-h-[400px] flex flex-col justify-between transition-colors duration-300">
      {/* Decorative cyber grid background lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/50 pb-3 relative z-10">
        <div className="flex items-center gap-2">
          <Terminal className="size-5 animate-pulse text-indigo-500 dark:text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">DEEP_RESEARCH_TELEMETRY_PIPELINE v1.6.3</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold tracking-widest uppercase">Streaming LIVE</span>
        </div>
      </div>

      {/* Progress Core */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 items-center relative z-10 flex-1">
        {/* Glowing Dial Column */}
        <div className="flex flex-col items-center justify-center col-span-1 border-r border-zinc-200 dark:border-zinc-800/50 pr-0 md:pr-6">
          <div className="relative size-32 flex items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.05)]">
            {/* Spinning loader */}
            <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 dark:border-indigo-400 animate-spin" style={{ animationDuration: '3s' }} />
            
            <div className="text-center">
              <span className="text-3xl font-extrabold tracking-tighter text-zinc-900 dark:text-white">{percentage}%</span>
              <p className="text-[9px] uppercase tracking-widest text-indigo-600 dark:text-indigo-400/80 mt-0.5 font-bold">COMPLETED</p>
            </div>
          </div>
        </div>

        {/* Current Activity Message Column */}
        <div className="col-span-2 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold">Node Step</span>
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
              <h3 className="text-sm font-bold text-zinc-800 dark:text-white uppercase tracking-wide">{currentStep.replace(/_/g, ' ')}</h3>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold">Operation Target Status</span>
            <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-950/20 min-h-[50px] flex items-center gap-2.5">
              <Loader2 className="size-4 animate-spin text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
              <p className="text-xs text-zinc-700 dark:text-zinc-200 leading-relaxed font-semibold">{currentMessage}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Log Console Output Area */}
      <div className="border border-zinc-200 dark:border-zinc-800/80 rounded-lg p-3 bg-zinc-100/50 dark:bg-zinc-950/30 h-[180px] overflow-y-auto flex flex-col justify-between relative z-10 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <div className="space-y-1 text-[11px] leading-relaxed">
          {logs.map((log) => {
            let textColor = 'text-zinc-650 dark:text-zinc-300';
            if (log.type === 'success') textColor = 'text-emerald-600 dark:text-emerald-400 font-bold';
            if (log.type === 'warn') textColor = 'text-amber-600 dark:text-amber-400 font-semibold';

            return (
              <div key={log.id} className="flex gap-2.5 items-start">
                <span className="text-zinc-400 dark:text-zinc-500 flex-shrink-0">[{log.timestamp}]</span>
                <span className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 uppercase font-bold text-[9px] border border-indigo-500/20 px-1 rounded-sm">{log.step}</span>
                <span className={`${textColor}`}>{log.message}</span>
              </div>
            );
          })}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
}
