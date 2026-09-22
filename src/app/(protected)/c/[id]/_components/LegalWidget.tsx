'use client';
import React from 'react';
import { Scale, Calendar, ExternalLink } from 'lucide-react';
import WidgetContainer from './WidgetContainer';

export interface LegislativeBill {
  type?: string;
  number?: string;
  congress?: string;
  title?: string;
  url?: string;
  latestAction?: { actionDate?: string; text?: string };
  [key: string]: unknown;
}

export default function LegalWidget({ legalData }: { legalData?: { legislation?: LegislativeBill[] } }) {
  const bills = legalData?.legislation || [];

  return (
    <WidgetContainer 
      icon={Scale} 
      iconColorClass="text-amber-400" 
      iconBgClass="bg-amber-500/10" 
      title="Legislative Data" 
      subtitle="Congress.gov API"
    >
      <div className="space-y-4">
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
    </WidgetContainer>
  );
}
