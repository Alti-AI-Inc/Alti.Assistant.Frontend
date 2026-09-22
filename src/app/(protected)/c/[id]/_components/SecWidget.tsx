'use client';
import React from 'react';
import { Briefcase, FileText, ExternalLink, Calendar } from 'lucide-react';
import WidgetContainer from './WidgetContainer';

export interface SecFiling {
  form: string;
  accessionNumber: string;
  filingDate: string;
  primaryDocument: string;
}

export interface SecData {
  companyName?: string;
  cik?: string;
  ticker?: string;
  filings?: SecFiling[];
}

export default function SecWidget({ secData }: { secData?: SecData }) {
  const filings = secData?.filings || [];

  return (
    <WidgetContainer 
      icon={Briefcase} 
      iconColorClass="text-emerald-400" 
      iconBgClass="bg-emerald-500/10" 
      title={`SEC EDGAR Filings: ${secData?.companyName || 'Corporate Data'}`} 
      subtitle={`CIK: ${secData?.cik || 'Unknown'} | Ticker: ${secData?.ticker || 'Unknown'}`}
    >
      <div className="space-y-4">
        {filings.length === 0 ? <p className="text-sm text-zinc-400">No recent filings found.</p> : filings.map((filing, idx) => {
          const docUrl = `https://www.sec.gov/Archives/edgar/data/${secData?.cik}/${filing.accessionNumber.replace(/-/g, '')}/${filing.primaryDocument}`;
          return (
            <div key={idx} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex items-center justify-between transition-all hover:bg-white/[0.04]">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-xs shrink-0">
                  {filing.form}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Form {filing.form}</h4>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {filing.filingDate}</span>
                    <span>Acc: {filing.accessionNumber}</span>
                  </div>
                </div>
              </div>
              <a href={docUrl} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          );
        })}
      </div>
    </WidgetContainer>
  );
}
