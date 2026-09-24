'use client';
import React from 'react';

interface VSCodeWidgetProps {
  workspaceData: { url?: string; workspaceName?: string };
}

export default function VSCodeWidget({ workspaceData }: VSCodeWidgetProps) {
  if (!workspaceData?.url) return null;

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl mt-4 animate-in fade-in zoom-in duration-500">
      <div className="bg-zinc-900 px-4 py-2 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs font-mono text-zinc-400 ml-2">Aphura Cloud IDE • {workspaceData.workspaceName || 'Workspace'}</span>
        </div>
        <a href={workspaceData.url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300">Open in New Tab ↗</a>
      </div>
      <div className="w-full h-[600px] bg-zinc-950 relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <span className="text-zinc-600 text-sm animate-pulse">Connecting to Aphura Edge Compute...</span>
        </div>
        <iframe 
          src={workspaceData.url} 
          className="w-full h-full border-none relative z-10 bg-transparent"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
        />
      </div>
    </div>
  );
}
