'use client';
import React from 'react';
import { Users } from 'lucide-react';
import WidgetContainer from './WidgetContainer';

export default function CensusWidget({ censusData }: { censusData?: { censusData?: any[] } }) {
  const rawData = censusData?.censusData || [];
  const headers = rawData[0] || [];
  const row = rawData[1] || [];

  return (
    <WidgetContainer 
      icon={Users} 
      iconColorClass="text-indigo-400" 
      iconBgClass="bg-indigo-500/10" 
      title="Demographics & Economy" 
      subtitle="US Census Bureau API"
    >
      {headers.length === 0 ? <p className="text-sm text-zinc-400">No census data found.</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {headers.map((header: string, idx: number) => {
            if (['state', 'county'].includes(header)) return null;
            const val = row[idx];
            const isNumber = !isNaN(Number(val));
            let displayVal = val;
            if (isNumber && val.length > 3) {
              displayVal = parseInt(val).toLocaleString();
            }
            return (
              <div key={idx} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{header.replace(/_/g, ' ')}</span>
                <span className="text-lg font-bold text-white">{displayVal}</span>
              </div>
            );
          })}
        </div>
      )}
    </WidgetContainer>
  );
}
