'use client';
import React from 'react';
import { Network, ArrowRight } from 'lucide-react';
import WidgetContainer from './WidgetContainer';

export default function MultiAgentWidget({ agentData }: { agentData?: any }) {
  const goal = agentData?.goal || 'Multi-Agent Execution';

  return (
    <WidgetContainer 
      icon={Network} 
      iconColorClass="text-purple-400" 
      iconBgClass="bg-purple-500/10" 
      title="Supervisor Agent Network" 
      subtitle="LangGraph Plan-and-Execute"
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.04]">
          <h4 className="text-md font-semibold text-white mb-3 leading-snug">Goal Orchestration</h4>
          <p className="text-zinc-300 text-sm">{goal}</p>
          
          <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="font-mono bg-white/5 px-2 py-1 rounded text-xs text-white">Supervisor</span>
              <ArrowRight className="h-3 w-3" />
              <span className="font-mono bg-white/5 px-2 py-1 rounded text-xs text-white">Workers</span>
            </div>
            <span className="text-purple-400 font-medium tracking-wide">✓ GRAPH EXECUTED</span>
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
}
