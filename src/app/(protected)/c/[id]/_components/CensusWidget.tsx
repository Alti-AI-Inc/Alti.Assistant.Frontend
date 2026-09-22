'use client';

import React from 'react';
import { Users, Building, MapPin, TrendingUp } from 'lucide-react';

interface CensusWidgetProps {
  censusData?: { censusData?: any[] };
}

export default function CensusWidget({ censusData }: CensusWidgetProps) {
  // Census data typically comes as an array of arrays where first row is headers.
  const rawData = censusData?.censusData || [];
  const headers = rawData[0] || [];
  const row = rawData[1] || [];

  return (
    <div className="relative my-4 overflow-hidden rounded-2xl border border-[#2b2f3a] bg-[#11141c] text-[#d1d4dc] shadow-2xl transition-all duration-300 hover:border-primary/40">
      <div className="flex items-center space-x-3 border-b border-[#2b2f3a] bg-[#171b26] px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-wide text-white">Demographics & Economy</h3>
          <p className="text-xs text-zinc-400">US Census Bureau API</p>
        </div>
      </div>
      <div className="p-6">
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
      </div>
    </div>
  );
}
