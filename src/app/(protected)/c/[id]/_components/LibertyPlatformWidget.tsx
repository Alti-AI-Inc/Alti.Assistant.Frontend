'use client';
import React from 'react';
import { Server, Activity } from 'lucide-react';
import WidgetContainer from './WidgetContainer';

export default function LibertyPlatformWidget({ platformData }: { platformData?: any }) {
  const action = platformData?.action || 'Platform Query';
  
  return (
    <WidgetContainer 
      icon={Server} 
      iconColorClass="text-rose-400" 
      iconBgClass="bg-rose-500/10" 
      title="Liberty Center One" 
      subtitle="Enterprise Sovereign Platform"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-rose-500/10 bg-rose-500/5 p-4">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-rose-400" />
            <div>
              <p className="text-xs text-rose-300/70 uppercase tracking-wider font-semibold">Platform Action</p>
              <p className="font-medium text-white">{action}</p>
            </div>
          </div>
          <span className="text-rose-400 font-mono text-xs bg-rose-500/10 px-2 py-1 rounded">200 OK</span>
        </div>
      </div>
    </WidgetContainer>
  );
}
