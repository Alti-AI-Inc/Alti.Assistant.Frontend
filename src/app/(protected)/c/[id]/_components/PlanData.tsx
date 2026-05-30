'use client';

import { useState } from 'react';
import {
  PlanAnalysis,
  PlanBrainstorm,
  PlanData as PlanDataType,
} from '@/types/plan-generation';
import {
  ChevronDown,
  FileText,
  Target,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Users,
  Clock,
  CheckCircle2,
  TrendingUp,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface PlanDataProps {
  plan: PlanDataType;
  analysis?: PlanAnalysis;
  brainstorm?: PlanBrainstorm;
}

export function PlanDataComponent({
  plan,
  analysis,
  brainstorm,
}: PlanDataProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    analysis: true,
    swot: true,
    objectives: false,
    phases: false,
    'action-items': false,
    resources: false,
    risks: false,
    'success-metrics': false,
    'next-steps': false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-rose-50 dark:bg-rose-950/20 text-rose-750 dark:text-rose-400 border-rose-250 dark:border-rose-900/30';
      case 'medium':
        return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-450 border-amber-250 dark:border-amber-900/30';
      case 'low':
        return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 border-emerald-250 dark:border-emerald-900/30';
      default:
        return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
    }
  };

  if (!plan) {
    return null;
  }

  return (
    <div className="w-full max-w-[796px] overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm my-4 flex flex-col transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700">
      {/* Header */}
      <div className="border-b border-zinc-150 dark:border-zinc-800 p-5 bg-zinc-50/50 dark:bg-zinc-800/10">
        <div className="flex gap-3.5">
          <div className="mt-1 shrink-0 text-blue-500">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="mb-1 text-sm font-bold text-zinc-900 dark:text-zinc-105 uppercase tracking-wider">
              {plan.title || 'Generated Plan'}
            </h3>
            <p className="text-xs leading-relaxed text-zinc-550 dark:text-zinc-400 font-medium">
              {plan.executive_summary}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5">
        {/* Analysis Section */}
        {analysis && (
          <div className="overflow-hidden rounded-xl border border-zinc-150 dark:border-zinc-800">
            <button
              onClick={() => toggleSection('analysis')}
              className="flex w-full items-center justify-between bg-zinc-50/10 dark:bg-zinc-900/10 px-4 py-3.5 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-500" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                  Analysis Summary
                </span>
                <Badge
                  variant="secondary"
                  className="bg-purple-50 dark:bg-purple-950/20 px-2 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400 border border-purple-100/10"
                >
                  Score: {analysis.clarity_score}/10
                </Badge>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-zinc-400 transition-transform duration-200',
                  openSections['analysis'] ? 'rotate-180 text-zinc-700 dark:text-zinc-200' : '',
                )}
              />
            </button>

            {openSections['analysis'] && (
              <div className="border-t border-zinc-150 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/10 p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                    <div className="rounded-xl border border-zinc-150 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 p-3 shadow-inner animate-fade-in">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        Plan Type
                      </span>
                      <p className="font-bold text-zinc-800 dark:text-zinc-150 mt-0.5">
                        {analysis.plan_type}
                      </p>
                    </div>
                    <div className="rounded-xl border border-zinc-150 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 p-3 shadow-inner">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        Complexity
                      </span>
                      <p className="font-bold text-zinc-800 dark:text-zinc-150 mt-0.5">
                        {analysis.complexity}
                      </p>
                    </div>
                    <div className="rounded-xl border border-zinc-150 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 p-3 shadow-inner">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        Timeline
                      </span>
                      <p className="font-bold text-zinc-800 dark:text-zinc-150 mt-0.5">
                        {analysis.estimated_timeline}
                      </p>
                    </div>
                    <div className="rounded-xl border border-zinc-150 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 p-3 shadow-inner">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        Readiness
                      </span>
                      <p className="font-bold text-zinc-800 dark:text-zinc-150 mt-0.5">
                        {analysis.readiness_for_planning}
                      </p>
                    </div>
                  </div>
                  {analysis.key_concepts?.length > 0 && (
                    <div className="rounded-xl border border-zinc-150 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 p-3.5">
                      <span className="mb-2 block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        Key Concepts Covered
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.key_concepts.map((concept, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-purple-50 dark:bg-purple-950/30 px-2.5 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400 border border-purple-100/10"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-xs leading-relaxed text-zinc-650 dark:text-zinc-350">
                    {analysis.summary}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SWOT Analysis Section */}
        {brainstorm?.swot_analysis && (
          <div className="overflow-hidden rounded-xl border border-zinc-150 dark:border-zinc-800">
            <button
              onClick={() => toggleSection('swot')}
              className="flex w-full items-center justify-between bg-zinc-50/10 dark:bg-zinc-900/10 px-4 py-3.5 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                  SWOT Analysis & Insights
                </span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-zinc-400 transition-transform duration-200',
                  openSections['swot'] ? 'rotate-180 text-zinc-700 dark:text-zinc-200' : '',
                )}
              />
            </button>

            {openSections['swot'] && (
              <div className="border-t border-zinc-150 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/10 p-4 space-y-3.5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* Strengths */}
                  <div className="rounded-xl border border-emerald-150 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10 p-3.5 shadow-sm">
                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Strengths
                    </span>
                    <ul className="space-y-1.5">
                      {brainstorm.swot_analysis.strengths?.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-xs leading-relaxed text-zinc-650 dark:text-zinc-350 font-medium"
                        >
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Weaknesses */}
                  <div className="rounded-xl border border-rose-150 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10 p-3.5 shadow-sm">
                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-450">
                      Weaknesses
                    </span>
                    <ul className="space-y-1.5">
                      {brainstorm.swot_analysis.weaknesses?.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-xs leading-relaxed text-zinc-650 dark:text-zinc-350 font-medium"
                        >
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Opportunities */}
                  <div className="rounded-xl border border-blue-150 dark:border-blue-900/40 bg-blue-50/20 dark:bg-blue-950/10 p-3.5 shadow-sm">
                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Opportunities
                    </span>
                    <ul className="space-y-1.5">
                      {brainstorm.swot_analysis.opportunities?.map(
                        (item, idx) => (
                          <li
                            key={idx}
                            className="text-xs leading-relaxed text-zinc-650 dark:text-zinc-350 font-medium"
                          >
                            • {item}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                  {/* Threats */}
                  <div className="rounded-xl border border-amber-150 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10 p-3.5 shadow-sm">
                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Threats
                    </span>
                    <ul className="space-y-1.5">
                      {brainstorm.swot_analysis.threats?.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-xs leading-relaxed text-zinc-650 dark:text-zinc-350 font-medium"
                        >
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Key Insights */}
                {brainstorm.key_insights?.length > 0 && (
                  <div className="rounded-xl border border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-3.5 shadow-sm">
                    <span className="mb-2.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      <Lightbulb className="h-3.5 w-3.5 text-amber-550 shrink-0" />
                      Key Insights & Findings
                    </span>
                    <ul className="space-y-1.5">
                      {brainstorm.key_insights.map((insight, idx) => (
                        <li
                          key={idx}
                          className="text-xs leading-relaxed text-zinc-650 dark:text-zinc-350 font-medium"
                        >
                          • {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Objectives Section */}
        {plan.objectives && plan.objectives.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-zinc-150 dark:border-zinc-800">
            <button
              onClick={() => toggleSection('objectives')}
              className="flex w-full items-center justify-between bg-zinc-50/10 dark:bg-zinc-900/10 px-4 py-3.5 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20"
            >
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                  Strategic Objectives
                </span>
                <Badge
                  variant="secondary"
                  className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 border border-zinc-200/10"
                >
                  {plan.objectives.length}
                </Badge>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-zinc-400 transition-transform duration-200',
                  openSections['objectives'] ? 'rotate-180 text-zinc-700 dark:text-zinc-200' : '',
                )}
              />
            </button>

            {openSections['objectives'] && (
              <div className="border-t border-zinc-150 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/10 p-4">
                <div className="space-y-3">
                  {plan.objectives.map((obj, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-zinc-150 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 p-4 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200"
                    >
                      <div className="mb-2.5 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-zinc-400">
                          #{idx + 1}
                        </span>
                        <span
                          className={cn(
                            'rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider',
                            getPriorityColor(obj.priority),
                          )}
                        >
                          {obj.priority}
                        </span>
                        <span className="rounded-md border border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 px-2 py-0.5 text-[9px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wider uppercase">
                          {obj.timeline}
                        </span>
                      </div>
                      <h4 className="mb-1 text-sm font-bold text-zinc-800 dark:text-zinc-105">
                        {obj.objective}
                      </h4>
                      <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-350">
                        {obj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Phases Section */}
        {plan.phases && plan.phases.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-zinc-150 dark:border-zinc-800">
            <button
              onClick={() => toggleSection('phases')}
              className="flex w-full items-center justify-between bg-zinc-50/10 dark:bg-zinc-900/10 px-4 py-3.5 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                  Project Roadmap Phases
                </span>
                <Badge
                  variant="secondary"
                  className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 border border-zinc-200/10"
                >
                  {plan.phases.length}
                </Badge>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-zinc-400 transition-transform duration-200',
                  openSections['phases'] ? 'rotate-180 text-zinc-700 dark:text-zinc-200' : '',
                )}
              />
            </button>

            {openSections['phases'] && (
              <div className="border-t border-zinc-150 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/10 p-5">
                <div className="relative border-l-2 border-zinc-150 dark:border-zinc-800 pl-6 ml-3.5 space-y-5">
                  {plan.phases.map((phase, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl border border-zinc-150 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 p-4 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200"
                    >
                      {/* Node Indicator circle */}
                      <span className="absolute -left-[37px] top-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950 border-2 border-blue-500 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                        {phase.phase_number}
                      </span>
                      
                      <div className="mb-2.5 flex flex-wrap items-center gap-2">
                        <h4 className="text-xs font-extrabold text-zinc-800 dark:text-zinc-150 uppercase tracking-wider">
                          {phase.name}
                        </h4>
                        <span className="rounded-md border border-blue-200/10 bg-blue-50 dark:bg-blue-950/30 px-2.5 py-0.5 text-[9px] font-bold uppercase text-blue-600 dark:text-blue-400">
                          {phase.duration}
                        </span>
                      </div>
                      {phase.deliverables?.length > 0 && (
                        <div className="mt-2.5 border-t border-zinc-100 dark:border-zinc-800/60 pt-2.5">
                          <span className="mb-1.5 block text-[10px] font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-wider">
                            Key Deliverables:
                          </span>
                          <ul className="space-y-1.5">
                            {phase.deliverables.map((d, dIdx) => (
                              <li
                                key={dIdx}
                                className="text-xs leading-relaxed text-zinc-650 dark:text-zinc-350 font-medium"
                              >
                                • {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Items Section */}
        {plan.action_items && plan.action_items.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-zinc-150 dark:border-zinc-800">
            <button
              onClick={() => toggleSection('action-items')}
              className="flex w-full items-center justify-between bg-zinc-50/10 dark:bg-zinc-900/10 px-4 py-3.5 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                  Strategic Action Items
                </span>
                <Badge
                  variant="secondary"
                  className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 border border-zinc-200/10"
                >
                  {plan.action_items.length}
                </Badge>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-zinc-400 transition-transform duration-200',
                  openSections['action-items'] ? 'rotate-180 text-zinc-700 dark:text-zinc-200' : '',
                )}
              />
            </button>

            {openSections['action-items'] && (
              <div className="border-t border-zinc-150 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/10 p-4">
                <div className="space-y-2">
                  {plan.action_items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-xl border border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-3 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-750 transition-all duration-150"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-zinc-800 dark:text-zinc-150 leading-relaxed">
                          {item.task}
                        </p>
                        <div className="mt-2 flex gap-1.5">
                          <span
                            className={cn(
                              'rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider',
                              getPriorityColor(item.priority),
                            )}
                          >
                            {item.priority}
                          </span>
                          <span className="rounded-md border border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 px-2 py-0.5 text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                            Effort: {item.estimated_effort}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Resources Section */}
        {plan.resources && (
          <div className="overflow-hidden rounded-xl border border-zinc-150 dark:border-zinc-800">
            <button
              onClick={() => toggleSection('resources')}
              className="flex w-full items-center justify-between bg-zinc-50/10 dark:bg-zinc-900/10 px-4 py-3.5 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20"
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                  Allocated Resources
                </span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-zinc-400 transition-transform duration-200',
                  openSections['resources'] ? 'rotate-180 text-zinc-700 dark:text-zinc-200' : '',
                )}
              />
            </button>

            {openSections['resources'] && (
              <div className="border-t border-zinc-150 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/10 p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-3.5 shadow-sm">
                    <span className="mb-1 block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Budget Estimate
                    </span>
                    <p className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100 mt-1">
                      {plan.resources.budget_estimate}
                    </p>
                  </div>
                  <div className="rounded-xl border border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-3.5 shadow-sm">
                    <span className="mb-2 block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Team Roles Required
                    </span>
                    <ul className="space-y-1">
                      {plan.resources.team_roles?.map((role, idx) => (
                        <li key={idx} className="text-xs text-zinc-650 dark:text-zinc-350 font-medium">
                          • {role}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-3.5 shadow-sm">
                    <span className="mb-2 block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Tools & Stack
                    </span>
                    <ul className="space-y-1">
                      {plan.resources.tools?.map((tool, idx) => (
                        <li key={idx} className="text-xs text-zinc-650 dark:text-zinc-350 font-medium">
                          • {tool}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Risks Section */}
        {plan.risks && plan.risks.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-zinc-150 dark:border-zinc-800">
            <button
              onClick={() => toggleSection('risks')}
              className="flex w-full items-center justify-between bg-zinc-50/10 dark:bg-zinc-900/10 px-4 py-3.5 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-500 animate-pulse" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                  Risks & Mitigation Plan
                </span>
                <Badge
                  variant="secondary"
                  className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 border border-zinc-200/10"
                >
                  {plan.risks.length}
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
                  {plan.risks.map((risk, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-rose-150 dark:border-rose-900 bg-rose-50/25 dark:bg-rose-950/10 p-4 shadow-sm"
                    >
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-rose-500" />
                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-150">
                          {risk.risk}
                        </span>
                        <span className="rounded-md border border-rose-200/20 bg-white dark:bg-zinc-900 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                          {risk.probability} Probability
                        </span>
                      </div>
                      <div className="mt-2.5 border-t border-rose-200/20 pt-2.5">
                        <span className="mb-1 block text-[10px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                          Mitigation Strategy:
                        </span>
                        <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-450">
                          {risk.mitigation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Success Metrics Section */}
        {plan.success_metrics && (
          <div className="overflow-hidden rounded-xl border border-zinc-150 dark:border-zinc-800">
            <button
              onClick={() => toggleSection('success-metrics')}
              className="flex w-full items-center justify-between bg-zinc-50/10 dark:bg-zinc-900/10 px-4 py-3.5 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-cyan-555" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                  Success Metrics & Milestones
                </span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-zinc-400 transition-transform duration-200',
                  openSections['success-metrics'] ? 'rotate-180 text-zinc-700 dark:text-zinc-200' : '',
                )}
              />
            </button>

            {openSections['success-metrics'] && (
              <div className="border-t border-zinc-150 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/10 p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-3.5 shadow-sm">
                    <span className="mb-2 block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Key Performance Indicators (KPIs)
                    </span>
                    <ul className="space-y-1.5">
                      {plan.success_metrics.kpis?.map((kpi, idx) => (
                        <li key={idx} className="text-xs text-zinc-650 dark:text-zinc-350 font-medium">
                          • {kpi}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-3.5 shadow-sm">
                    <span className="mb-2 block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Target Milestones
                    </span>
                    <ul className="space-y-1.5">
                      {plan.success_metrics.milestones?.map(
                        (milestone, idx) => (
                          <li key={idx} className="text-xs text-zinc-650 dark:text-zinc-350 font-medium">
                            • {milestone}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Next Steps Section */}
        {plan.next_steps && plan.next_steps.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-zinc-150 dark:border-zinc-800">
            <button
              onClick={() => toggleSection('next-steps')}
              className="flex w-full items-center justify-between bg-zinc-50/10 dark:bg-zinc-900/10 px-4 py-3.5 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20"
            >
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                  Immediate Next Steps
                </span>
                <Badge
                  variant="secondary"
                  className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 border border-zinc-200/10"
                >
                  {plan.next_steps.length}
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
                  {plan.next_steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3 text-xs">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-55/10 dark:bg-blue-950 border border-blue-200 text-[10px] font-bold text-blue-600 dark:text-blue-450">
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

        {/* Timeline Info */}
        {plan.timeline && (
          <div className="mt-3 rounded-xl border border-blue-200/20 bg-blue-50/10 dark:bg-blue-950/10 p-4 transition-all hover:border-blue-200/30">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wide">
                Grounded Roadmap Timeline
              </span>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-white/40 dark:bg-zinc-900/30 p-3">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Target Completion Date
                </span>
                <p className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100 mt-0.5">
                  {plan.timeline.estimated_completion}
                </p>
              </div>
              {plan.timeline.critical_path?.length > 0 && (
                <div className="rounded-lg bg-white/40 dark:bg-zinc-900/30 p-3">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Critical Path Milestones
                  </span>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1 leading-snug">
                    {plan.timeline.critical_path.join(' → ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
