'use client';
import React from 'react';
import { Microscope, Users, BookOpen } from 'lucide-react';
import WidgetContainer from './WidgetContainer';

export default function DeepResearchWidget({ researchData }: { researchData?: any }) {
  const query = researchData?.query || 'Research Swarm';
  const perspectivesCount = researchData?.perspectives || 3;

  return (
    <WidgetContainer 
      icon={Microscope} 
      iconColorClass="text-emerald-400" 
      iconBgClass="bg-emerald-500/10" 
      title="Deep Research Swarm" 
      subtitle="LangGraph Multi-Agent Orchestration"
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.04]">
          <h4 className="text-md font-semibold text-white mb-3 leading-snug">Research Objective</h4>
          <p className="text-zinc-300 text-sm">{query}</p>
          
          <div className="mt-4 flex items-center gap-4 border-t border-white/5 pt-4">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/5 px-3 py-2 text-sm">
              <Users className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="font-medium text-emerald-200">{perspectivesCount} Autonomous Agents Deployed</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/5 px-3 py-2 text-sm">
              <BookOpen className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="font-medium text-emerald-200">Synthesis Complete</span>
            </div>
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
}
