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
    'main-ideas': false,
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
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (!data || !data.mainIdeas || data.mainIdeas.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 p-4">
        <div className="flex gap-3">
          <div className="mt-0.5 shrink-0 text-yellow-600">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              Brainstorm Results
            </h3>
            <p className="text-sm leading-relaxed text-gray-500">
              {data.summary}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2 p-4">
        {/* Main Ideas Section */}
        {data.mainIdeas && data.mainIdeas.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <button
              onClick={() => toggleSection('main-ideas')}
              className="flex w-full items-center justify-between bg-white px-4 py-3 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-gray-900">
                  Main Ideas
                </span>
                <Badge
                  variant="secondary"
                  className="bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                >
                  {data.mainIdeas.length}
                </Badge>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-gray-400 transition-transform duration-200',
                  openSections['main-ideas'] ? 'rotate-180' : '',
                )}
              />
            </button>

            {openSections['main-ideas'] && (
              <div className="border-t border-gray-200 bg-gray-50/50 p-4">
                <div className="space-y-3">
                  {data.mainIdeas.map((idea, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="mb-3">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500">
                            #{idx + 1}
                          </span>
                          <span
                            className={cn(
                              'rounded border px-2 py-0.5 text-[11px] font-semibold uppercase',
                              getPriorityColor(idea.priority),
                            )}
                          >
                            {idea.priority}
                          </span>
                        </div>
                        <h4 className="mb-2 text-base font-semibold text-gray-900">
                          {idea.title}
                        </h4>
                        <div className="inline-block rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600">
                          {idea.category}
                        </div>
                      </div>
                      <p className="mb-3 text-sm leading-relaxed text-gray-600">
                        {idea.description}
                      </p>
                      {idea.reasoning && (
                        <div className="border-t border-gray-100 pt-3">
                          <p className="mb-1 text-xs font-semibold text-gray-900">
                            Reasoning:
                          </p>
                          <p className="text-xs leading-relaxed text-gray-500">
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
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <button
              onClick={() => toggleSection('opportunities')}
              className="flex w-full items-center justify-between bg-white px-4 py-3 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-gray-900">
                  Opportunities
                </span>
                <Badge
                  variant="secondary"
                  className="bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                >
                  {data.opportunities.length}
                </Badge>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-gray-400 transition-transform duration-200',
                  openSections['opportunities'] ? 'rotate-180' : '',
                )}
              />
            </button>
            {openSections['opportunities'] && (
              <div className="border-t border-gray-200 bg-gray-50/50 p-4">
                <div className="space-y-3">
                  {data.opportunities.map((opp, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 rounded-lg border border-green-200 bg-green-50/50 p-4"
                    >
                      <Target className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {opp.title}
                          </span>
                          <span className="rounded border border-green-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600">
                            {opp.impact} impact
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-600">
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
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <button
              onClick={() => toggleSection('risks')}
              className="flex w-full items-center justify-between bg-white px-4 py-3 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-semibold text-gray-900">
                  Potential Challenges
                </span>
                <Badge
                  variant="secondary"
                  className="bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                >
                  {data.risks.length}
                </Badge>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-gray-400 transition-transform duration-200',
                  openSections['risks'] ? 'rotate-180' : '',
                )}
              />
            </button>
            {openSections['risks'] && (
              <div className="border-t border-gray-200 bg-gray-50/50 p-4">
                <div className="space-y-3">
                  {data.risks.map((risk, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 rounded-lg border border-red-200 bg-red-50/50 p-4"
                    >
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                      <div className="w-full">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {risk.title}
                          </span>
                          <span className="rounded border border-red-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600">
                            {risk.severity} severity
                          </span>
                        </div>
                        <p className="mb-3 text-sm leading-relaxed text-gray-600">
                          {risk.description}
                        </p>
                        {risk.mitigation && (
                          <div className="mt-3 border-t border-red-200/50 pt-3">
                            <span className="mb-1 block text-xs font-semibold text-gray-900">
                              Mitigation strategy:
                            </span>
                            <p className="text-xs leading-relaxed text-gray-600">
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
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <button
              onClick={() => toggleSection('next-steps')}
              className="flex w-full items-center justify-between bg-white px-4 py-3 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-900">
                  Next Steps
                </span>
                <Badge
                  variant="secondary"
                  className="bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                >
                  {data.nextSteps.length}
                </Badge>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-gray-400 transition-transform duration-200',
                  openSections['next-steps'] ? 'rotate-180' : '',
                )}
              />
            </button>
            {openSections['next-steps'] && (
              <div className="border-t border-gray-200 bg-gray-50/50 p-4">
                <div className="space-y-2">
                  {data.nextSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-3 text-sm">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                        {idx + 1}
                      </div>
                      <p className="pt-0.5 leading-relaxed text-gray-600">
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
