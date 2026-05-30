'use client';

import { useState } from 'react';
import {
  BrainstormData as BrainstormDataType,
  IdeaAnalysis,
} from '@/types/brainstorm';
import {
  ChevronDown,
  Lightbulb,
  Target,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface BrainstormDataProps {
  data: BrainstormDataType;
  analysis?: IdeaAnalysis;
}

export function BrainstormData({ data, analysis }: BrainstormDataProps) {
  // Sections state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'main-ideas': true,
    opportunities: false,
    risks: false,
    'next-steps': false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-250 dark:border-rose-900/30';
      case 'medium':
        return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-250 dark:border-amber-900/30';
      case 'low':
        return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-250 dark:border-emerald-900/30';
      default:
        return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
    }
  };

  if (!data || !data.mainIdeas || data.mainIdeas.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-[796px] overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm my-4 flex flex-col transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700">
      {/* Header */}
      <div className="border-b border-zinc-150 dark:border-zinc-800 p-5 bg-zinc-50/50 dark:bg-zinc-800/10">
        <div className="flex gap-3.5">
          <div className="mt-1 shrink-0 text-amber-500 animate-pulse">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <h3 className="mb-1 text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Brainstorm Results
            </h3>
            <p className="text-xs leading-relaxed text-zinc-550 dark:text-zinc-400 font-medium">
              {data.summary}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5">
        {/* Main Ideas Section */}
        {data.mainIdeas && data.mainIdeas.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-zinc-150 dark:border-zinc-800">
            <button
              onClick={() => toggleSection('main-ideas')}
              className="flex w-full items-center justify-between bg-zinc-50/10 dark:bg-zinc-900/10 px-4 py-3.5 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-violet-500" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                  Main Ideas
                </span>
                <Badge
                  variant="secondary"
                  className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 border border-zinc-200/10"
                >
                  {data.mainIdeas.length}
                </Badge>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-zinc-400 transition-transform duration-200',
                  openSections['main-ideas'] ? 'rotate-180 text-zinc-700 dark:text-zinc-200' : '',
                )}
              />
            </button>

            {openSections['main-ideas'] && (
              <div className="border-t border-zinc-150 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/10 p-4">
                <div className="space-y-3">
                  {data.mainIdeas.map((idea, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-zinc-150 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 p-4 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200"
                    >
                      <div className="mb-3">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-[10px] font-bold text-zinc-400">
                            #{idx + 1}
                          </span>
                          <span
                            className={cn(
                              'rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider',
                              getPriorityColor(idea.priority),
                            )}
                          >
                            {idea.priority}
                          </span>
                        </div>
                        <h4 className="mb-2 text-sm font-bold text-zinc-800 dark:text-zinc-105 leading-snug">
                          {idea.title}
                        </h4>
                        <div className="inline-block rounded-md border border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/45 px-2.5 py-0.5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
                          {idea.category}
                        </div>
                      </div>
                      <p className="mb-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-350">
                        {idea.description}
                      </p>
                      {idea.reasoning && (
                        <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-3">
                          <p className="mb-1 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                            Reasoning:
                          </p>
                          <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 font-medium">
                            {idea.reasoning}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Opportunities Section */}
        {data.opportunities && data.opportunities.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-zinc-150 dark:border-zinc-800">
            <button
              onClick={() => toggleSection('opportunities')}
              className="flex w-full items-center justify-between bg-zinc-50/10 dark:bg-zinc-900/10 px-4 py-3.5 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20"
            >
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                  Opportunities
                </span>
                <Badge
                  variant="secondary"
                  className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 border border-zinc-200/10"
                >
                  {data.opportunities.length}
                </Badge>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-zinc-400 transition-transform duration-200',
                  openSections['opportunities'] ? 'rotate-180 text-zinc-700 dark:text-zinc-200' : '',
                )}
              />
            </button>
            {openSections['opportunities'] && (
              <div className="border-t border-zinc-150 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/10 p-4">
                <div className="space-y-3">
                  {data.opportunities.map((opp, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 rounded-xl border border-emerald-150 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10 p-4"
                    >
                      <Target className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <div>
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-150 leading-none">
                            {opp.title}
                          </span>
                          <span className="rounded-md border border-emerald-200/20 bg-white/40 dark:bg-zinc-900/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            {opp.impact} impact
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-zinc-650 dark:text-zinc-350">
                          {opp.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Risks Section */}
        {data.risks && data.risks.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-zinc-150 dark:border-zinc-800">
            <button
              onClick={() => toggleSection('risks')}
              className="flex w-full items-center justify-between bg-zinc-50/10 dark:bg-zinc-900/10 px-4 py-3.5 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-500 animate-pulse" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                  Potential Challenges
                </span>
                <Badge
                  variant="secondary"
                  className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 border border-zinc-200/10"
                >
                  {data.risks.length}
                </Badge>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-zinc-400 transition-transform duration-200',
                  openSections['risks'] ? 'rotate-180 text-zinc-700 dark:text-zinc-200' : '',
                )}
              />
            </button>
            {openSections['risks'] && (
              <div className="border-t border-zinc-150 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/10 p-4">
                <div className="space-y-3">
                  {data.risks.map((risk, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 rounded-xl border border-rose-150 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10 p-4"
                    >
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                      <div className="w-full">
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-150 leading-none">
                            {risk.title}
                          </span>
                          <span className="rounded-md border border-rose-200/20 bg-white/40 dark:bg-zinc-900/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-450">
                            {risk.severity} severity
                          </span>
                        </div>
                        <p className="mb-3 text-xs leading-relaxed text-zinc-650 dark:text-zinc-350">
                          {risk.description}
                        </p>
                        {risk.mitigation && (
                          <div className="mt-3 border-t border-rose-200/20 pt-3">
                            <span className="mb-1 block text-[10px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                              Mitigation Strategy:
                            </span>
                            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 font-medium">
                              {risk.mitigation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Next Steps Section */}
        {data.nextSteps && data.nextSteps.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-zinc-150 dark:border-zinc-800">
            <button
              onClick={() => toggleSection('next-steps')}
              className="flex w-full items-center justify-between bg-zinc-50/10 dark:bg-zinc-900/10 px-4 py-3.5 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20"
            >
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-blue-550" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                  Next Steps
                </span>
                <Badge
                  variant="secondary"
                  className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 border border-zinc-200/10"
                >
                  {data.nextSteps.length}
                </Badge>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-zinc-400 transition-transform duration-200',
                  openSections['next-steps'] ? 'rotate-180 text-zinc-700 dark:text-zinc-200' : '',
                )}
              />
            </button>
            {openSections['next-steps'] && (
              <div className="border-t border-zinc-150 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/10 p-4">
                <div className="space-y-2.5">
                  {data.nextSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-3 text-xs">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-150 dark:border-blue-900 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                        {idx + 1}
                      </div>
                      <p className="pt-0.5 leading-relaxed text-zinc-650 dark:text-zinc-350 font-medium">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
