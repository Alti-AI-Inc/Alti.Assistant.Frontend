'use client';

import React from 'react';
import { Scale, FileText, Calendar, ExternalLink } from 'lucide-react';

export interface LegislativeBill {
  type?: string;
  number?: string;
  congress?: string;
  title?: string;
  url?: string;
  latestAction?: { actionDate?: string; text?: string };
  [key: string]: unknown;
}

interface LegalWidgetProps {
  legalData?: { legislation?: LegislativeBill[] };
}

export default function LegalWidget({ legalData }: LegalWidgetProps) {
  const bills = legalData?.legislation || [];

  return (
    <div className="relative my-4 overflow-hidden rounded-2xl border border-[#2b2f3a] bg-[#11141c] text-[#d1d4dc] shadow-2xl transition-all duration-300 hover:border-primary/40">
      <div className="flex items-center space-x-3 border-b border-[#2b2f3a] bg-[#171b26] px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
          <Scale className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-wide text-white">Legislative Data</h3>
          <p className="text-xs text-zinc-400">Congress.gov API</p>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {bills.length === 0 ? <p className="text-sm text-zinc-400">No legislative data found.</p> : bills.map((bill, idx) => (
          <div key={idx} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.04]">
            <div className="mb-2 flex items-center justify-between">
              <span className="inline-flex items-center rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-zinc-200">
                {bill.type}{bill.number} ({bill.congress} Congress)
              </span>
              {bill.url && (
                <a href={bill.url} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            <h4 className="text-md font-semibold text-white mb-3 leading-snug">{bill.title}</h4>
            {bill.latestAction && (
              <div className="flex items-start gap-2 rounded-lg bg-amber-500/5 p-3 text-sm">
                <Calendar className="mt-0.5 h-4 w-4 text-amber-500/70 shrink-0" />
                <div>
                  <p className="font-medium text-amber-200">{bill.latestAction.actionDate}</p>
                  <p className="text-amber-100/70 mt-0.5 text-xs">{bill.latestAction.text}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
