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

    const base = process.env.NEXT_PUBLIC_API_URL || 'https://altihq.com/api/v1';
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
    <div className="w-full rounded-2xl border border-teal-500/20 bg-slate-950 p-6 font-mono text-teal-400 shadow-2xl relative overflow-hidden my-4 min-h-[400px] flex flex-col justify-between">
      {/* Decorative cyber grid background lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b border-teal-500/20 pb-3 relative z-10">
        <div className="flex items-center gap-2">
          <Terminal className="size-5 animate-pulse text-teal-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-teal-500">DEEP_RESEARCH_TELEMETRY_PIPELINE v1.6.3</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-teal-500 animate-ping" />
          <span className="text-[10px] text-teal-500 font-semibold tracking-widest uppercase">Streaming LIVE</span>
        </div>
      </div>

      {/* Progress Core */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 items-center relative z-10 flex-1">
        {/* Glowing Dial Column */}
        <div className="flex flex-col items-center justify-center col-span-1 border-r border-teal-500/10 pr-0 md:pr-6">
          <div className="relative size-32 flex items-center justify-center rounded-full border border-teal-500/20 bg-teal-950/20 shadow-[0_0_20px_rgba(15,118,110,0.1)]">
            {/* Spinning loader */}
            <div className="absolute inset-0 rounded-full border-t-2 border-teal-400 animate-spin" style={{ animationDuration: '3s' }} />
            
            <div className="text-center">
              <span className="text-3xl font-extrabold tracking-tighter text-white">{percentage}%</span>
              <p className="text-[9px] uppercase tracking-widest text-teal-500/80 mt-0.5">COMPLETED</p>
            </div>
          </div>
        </div>

        {/* Current Activity Message Column */}
        <div className="col-span-2 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-teal-500/60 font-bold">Node Step</span>
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-emerald-400 flex-shrink-0" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">{currentStep.replace(/_/g, ' ')}</h3>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-teal-500/60 font-bold">Operation Target Status</span>
            <div className="p-3 rounded-lg border border-teal-500/10 bg-teal-950/10 min-h-[50px] flex items-center gap-2.5">
              <Loader2 className="size-4 animate-spin text-teal-400 flex-shrink-0" />
              <p className="text-xs text-teal-100 leading-relaxed font-semibold">{currentMessage}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Log Console Output Area */}
      <div className="border border-teal-500/10 rounded-lg p-3 bg-slate-950/90 h-[180px] overflow-y-auto flex flex-col justify-between relative z-10">
        <div className="space-y-1 text-[11px] leading-relaxed">
          {logs.map((log) => {
            let textColor = 'text-teal-300';
            if (log.type === 'success') textColor = 'text-emerald-400 font-bold';
            if (log.type === 'warn') textColor = 'text-amber-400';

            return (
              <div key={log.id} className="flex gap-2.5 items-start">
                <span className="text-teal-500/50 flex-shrink-0">[{log.timestamp}]</span>
                <span className="text-emerald-500/70 flex-shrink-0 uppercase font-bold text-[9px] border border-emerald-500/20 px-1 rounded-sm">{log.step}</span>
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
