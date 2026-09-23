'use client';
import React from 'react';
import { Workflow, CheckCircle2, Clock } from 'lucide-react';
import WidgetContainer from './WidgetContainer';

export default function TemporalWorkflowWidget({ workflowData }: { workflowData?: any }) {
  const workflowName = workflowData?.workflowName || 'Automation Workflow';
  const runId = workflowData?.runId || 'unknown-run';
  const status = workflowData?.status || 'running';

  return (
    <WidgetContainer 
      icon={Workflow} 
      iconColorClass="text-blue-400" 
      iconBgClass="bg-blue-500/10" 
      title="Durable Workflow" 
      subtitle="Powered by Temporal.io"
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.04]">
          <h4 className="text-md font-semibold text-white mb-2 leading-snug">{workflowName}</h4>
          <p className="font-mono text-xs text-zinc-500 mb-4 break-all">Run ID: {runId}</p>
          
          <div className="flex items-center gap-2 rounded-lg bg-white/5 p-3 text-sm">
            {status.toLowerCase() === 'completed' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <Clock className="h-4 w-4 text-blue-400 shrink-0 animate-pulse" />
            )}
            <div>
              <p className="font-medium text-zinc-200">
                Status: <span className="capitalize">{status}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
}
