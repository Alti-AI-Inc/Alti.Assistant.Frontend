'use client';

import React from 'react';
import { Activity, Pill, AlertTriangle, Info } from 'lucide-react';

export interface MedicalDrug {
  openfda?: { brand_name?: string[]; generic_name?: string[]; manufacturer_name?: string[] };
  purpose?: string[];
  warnings?: string[];
  [key: string]: unknown;
}

interface MedicalWidgetProps {
  medicalData?: { drugs?: MedicalDrug[] };
}

export default function MedicalWidget({ medicalData }: MedicalWidgetProps) {
  const drugs = medicalData?.drugs || [];

  return (
    <div className="relative my-4 overflow-hidden rounded-2xl border border-[#2b2f3a] bg-[#11141c] text-[#d1d4dc] shadow-2xl transition-all duration-300 hover:border-primary/40">
      <div className="flex items-center space-x-3 border-b border-[#2b2f3a] bg-[#171b26] px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-wide text-white">Medical & Drug Data</h3>
          <p className="text-xs text-zinc-400">OpenFDA API</p>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {drugs.length === 0 ? <p className="text-sm text-zinc-400">No drug data found.</p> : drugs.map((drug, idx) => (
          <div key={idx} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.04]">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Pill className="h-4 w-4 text-rose-400" />
                  {drug.openfda?.brand_name?.[0] || 'Unknown Brand'}
                </h4>
                <p className="text-sm text-zinc-400 mt-1">
                  {drug.openfda?.generic_name?.[0]} • {drug.openfda?.manufacturer_name?.[0]}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              {drug.purpose && drug.purpose.length > 0 && (
                <div className="rounded-lg bg-zinc-500/5 p-3">
                  <h5 className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-1">
                    <Info className="h-3.5 w-3.5" /> Purpose
                  </h5>
                  <p className="text-sm text-zinc-400 line-clamp-2">{drug.purpose[0]}</p>
                </div>
              )}
              {drug.warnings && drug.warnings.length > 0 && (
                <div className="rounded-lg bg-rose-500/5 p-3 border border-rose-500/10">
                  <h5 className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 mb-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> Warnings
                  </h5>
                  <p className="text-sm text-rose-200/70 line-clamp-3">{drug.warnings[0]}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
