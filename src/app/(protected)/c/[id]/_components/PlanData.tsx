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
    analysis: false,
    swot: false,
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
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (!plan) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 p-4">
        <div className="flex gap-3">
          <div className="mt-0.5 shrink-0 text-blue-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              {plan.title || 'Generated Plan'}
            </h3>
            <p className="text-sm leading-relaxed text-gray-500">
              {plan.executive_summary}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2 p-4">
        {/* Analysis Section */}
        {analysis && (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <button
              onClick={() => toggleSection('analysis')}
              className="flex w-full items-center justify-between bg-white px-4 py-3 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-gray-900">
                  Analysis
                </span>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700"
                >
                  Score: {analysis.clarity_score}/10
                </Badge>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-gray-400 transition-transform duration-200',
                  openSections['analysis'] ? 'rotate-180' : '',
                )}
              />
            </button>

            {openSections['analysis'] && (
              <div className="border-t border-gray-200 bg-gray-50/50 p-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                      <span className="text-xs font-medium text-gray-500">
                        Plan Type
                      </span>
                      <p className="font-medium text-gray-900">
                        {analysis.plan_type}
                      </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                      <span className="text-xs font-medium text-gray-500">
                        Complexity
                      </span>
                      <p className="font-medium text-gray-900">
                        {analysis.complexity}
                      </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                      <span className="text-xs font-medium text-gray-500">
                        Estimated Timeline
                      </span>
                      <p className="font-medium text-gray-900">
                        {analysis.estimated_timeline}
                      </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                      <span className="text-xs font-medium text-gray-500">
                        Readiness
                      </span>
                      <p className="font-medium text-gray-900">
                        {analysis.readiness_for_planning}
                      </p>
                    </div>
                  </div>
                  {analysis.key_concepts?.length > 0 && (
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                      <span className="mb-2 block text-xs font-medium text-gray-500">
                        Key Concepts
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {analysis.key_concepts.map((concept, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed text-gray-600">
                    {analysis.summary}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SWOT Analysis Section */}
        {brainstorm?.swot_analysis && (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <button
              onClick={() => toggleSection('swot')}
              className="flex w-full items-center justify-between bg-white px-4 py-3 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-semibold text-gray-900">
                  SWOT Analysis
                </span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-gray-400 transition-transform duration-200',
                  openSections['swot'] ? 'rotate-180' : '',
                )}
              />
            </button>

            {openSections['swot'] && (
              <div className="border-t border-gray-200 bg-gray-50/50 p-4">
                <div className="grid grid-cols-2 gap-3">
                  {/* Strengths */}
                  <div className="rounded-lg border border-green-200 bg-green-50/50 p-3">
                    <span className="mb-2 block text-xs font-semibold text-green-700">
                      Strengths
                    </span>
                    <ul className="space-y-1">
                      {brainstorm.swot_analysis.strengths?.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-xs leading-relaxed text-gray-600"
                        >
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Weaknesses */}
                  <div className="rounded-lg border border-red-200 bg-red-50/50 p-3">
                    <span className="mb-2 block text-xs font-semibold text-red-700">
                      Weaknesses
                    </span>
                    <ul className="space-y-1">
                      {brainstorm.swot_analysis.weaknesses?.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-xs leading-relaxed text-gray-600"
                        >
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Opportunities */}
                  <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3">
                    <span className="mb-2 block text-xs font-semibold text-blue-700">
                      Opportunities
                    </span>
                    <ul className="space-y-1">
                      {brainstorm.swot_analysis.opportunities?.map(
                        (item, idx) => (
                          <li
                            key={idx}
                            className="text-xs leading-relaxed text-gray-600"
                          >
                            • {item}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                  {/* Threats */}
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50/50 p-3">
                    <span className="mb-2 block text-xs font-semibold text-yellow-700">
                      Threats
                    </span>
                    <ul className="space-y-1">
                      {brainstorm.swot_analysis.threats?.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-xs leading-relaxed text-gray-600"
                        >
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Key Insights */}
                {brainstorm.key_insights?.length > 0 && (
                  <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3">
                    <span className="mb-2 block text-xs font-semibold text-gray-700">
                      <Lightbulb className="mr-1 inline h-3 w-3" />
                      Key Insights
                    </span>
                    <ul className="space-y-1">
                      {brainstorm.key_insights.map((insight, idx) => (
                        <li
                          key={idx}
                          className="text-xs leading-relaxed text-gray-600"
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
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <button
              onClick={() => toggleSection('objectives')}
              className="flex w-full items-center justify-between bg-white px-4 py-3 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-gray-900">
                  Objectives
                </span>
                <Badge
                  variant="secondary"
                  className="bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                >
                  {plan.objectives.length}
                </Badge>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-gray-400 transition-transform duration-200',
                  openSections['objectives'] ? 'rotate-180' : '',
                )}
              />
            </button>

            {openSections['objectives'] && (
              <div className="border-t border-gray-200 bg-gray-50/50 p-4">
                <div className="space-y-3">
                  {plan.objectives.map((obj, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">
                          #{idx + 1}
                        </span>
                        <span
                          className={cn(
                            'rounded border px-2 py-0.5 text-[11px] font-semibold uppercase',
                            getPriorityColor(obj.priority),
                          )}
                        >
                          {obj.priority}
                        </span>
                        <span className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                          {obj.timeline}
                        </span>
                      </div>
                      <h4 className="mb-1 text-sm font-semibold text-gray-900">
                        {obj.objective}
                      </h4>
                      <p className="text-xs leading-relaxed text-gray-600">
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
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <button
              onClick={() => toggleSection('phases')}
              className="flex w-full items-center justify-between bg-white px-4 py-3 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-900">
                  Project Phases
                </span>
                <Badge
                  variant="secondary"
                  className="bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                >
                  {plan.phases.length}
                </Badge>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-gray-400 transition-transform duration-200',
                  openSections['phases'] ? 'rotate-180' : '',
                )}
              />
            </button>

            {openSections['phases'] && (
              <div className="border-t border-gray-200 bg-gray-50/50 p-4">
                <div className="space-y-3">
                  {plan.phases.map((phase, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-blue-200 bg-blue-50/50 p-4"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                          {phase.phase_number}
                        </span>
                        <h4 className="text-sm font-semibold text-gray-900">
                          {phase.name}
                        </h4>
                        <span className="rounded border border-blue-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600">
                          {phase.duration}
                        </span>
                      </div>
                      {phase.deliverables?.length > 0 && (
                        <div className="mt-2">
                          <span className="mb-1 block text-xs font-medium text-gray-500">
                            Deliverables:
                          </span>
                          <ul className="space-y-1">
                            {phase.deliverables.map((d, dIdx) => (
                              <li
                                key={dIdx}
                                className="text-xs leading-relaxed text-gray-600"
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
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <button
              onClick={() => toggleSection('action-items')}
              className="flex w-full items-center justify-between bg-white px-4 py-3 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-semibold text-gray-900">
                  Action Items
                </span>
                <Badge
                  variant="secondary"
                  className="bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                >
                  {plan.action_items.length}
                </Badge>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-gray-400 transition-transform duration-200',
                  openSections['action-items'] ? 'rotate-180' : '',
                )}
              />
            </button>

            {openSections['action-items'] && (
              <div className="border-t border-gray-200 bg-gray-50/50 p-4">
                <div className="space-y-2">
                  {plan.action_items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {item.task}
                        </p>
                        <div className="mt-1 flex gap-2">
                          <span
                            className={cn(
                              'rounded border px-2 py-0.5 text-[11px] font-semibold uppercase',
                              getPriorityColor(item.priority),
                            )}
                          >
                            {item.priority}
                          </span>
                          <span className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                            {item.estimated_effort}
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
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <button
              onClick={() => toggleSection('resources')}
              className="flex w-full items-center justify-between bg-white px-4 py-3 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-semibold text-gray-900">
                  Resources
                </span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-gray-400 transition-transform duration-200',
                  openSections['resources'] ? 'rotate-180' : '',
                )}
              />
            </button>

            {openSections['resources'] && (
              <div className="border-t border-gray-200 bg-gray-50/50 p-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-gray-200 bg-white p-3">
                    <span className="mb-2 block text-xs font-medium text-gray-500">
                      Budget
                    </span>
                    <p className="text-sm font-semibold text-gray-900">
                      {plan.resources.budget_estimate}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-3">
                    <span className="mb-2 block text-xs font-medium text-gray-500">
                      Team Roles
                    </span>
                    <ul className="space-y-1">
                      {plan.resources.team_roles?.map((role, idx) => (
                        <li key={idx} className="text-xs text-gray-600">
                          • {role}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-3">
                    <span className="mb-2 block text-xs font-medium text-gray-500">
                      Tools
                    </span>
                    <ul className="space-y-1">
                      {plan.resources.tools?.map((tool, idx) => (
                        <li key={idx} className="text-xs text-gray-600">
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
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <button
              onClick={() => toggleSection('risks')}
              className="flex w-full items-center justify-between bg-white px-4 py-3 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-semibold text-gray-900">
                  Risks & Mitigation
                </span>
                <Badge
                  variant="secondary"
                  className="bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                >
                  {plan.risks.length}
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
                  {plan.risks.map((risk, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-red-200 bg-red-50/50 p-4"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-semibold text-gray-900">
                          {risk.risk}
                        </span>
                        <span className="rounded border border-red-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600">
                          {risk.probability} probability
                        </span>
                      </div>
                      <div className="mt-2 border-t border-red-200/50 pt-2">
                        <span className="mb-1 block text-xs font-semibold text-gray-700">
                          Mitigation:
                        </span>
                        <p className="text-xs leading-relaxed text-gray-600">
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
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <button
              onClick={() => toggleSection('success-metrics')}
              className="flex w-full items-center justify-between bg-white px-4 py-3 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-cyan-600" />
                <span className="text-sm font-semibold text-gray-900">
                  Success Metrics
                </span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-gray-400 transition-transform duration-200',
                  openSections['success-metrics'] ? 'rotate-180' : '',
                )}
              />
            </button>

            {openSections['success-metrics'] && (
              <div className="border-t border-gray-200 bg-gray-50/50 p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-gray-200 bg-white p-3">
                    <span className="mb-2 block text-xs font-medium text-gray-500">
                      KPIs
                    </span>
                    <ul className="space-y-1">
                      {plan.success_metrics.kpis?.map((kpi, idx) => (
                        <li key={idx} className="text-xs text-gray-600">
                          • {kpi}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-3">
                    <span className="mb-2 block text-xs font-medium text-gray-500">
                      Milestones
                    </span>
                    <ul className="space-y-1">
                      {plan.success_metrics.milestones?.map(
                        (milestone, idx) => (
                          <li key={idx} className="text-xs text-gray-600">
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
                  {plan.next_steps.length}
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
                  {plan.next_steps.map((step, idx) => (
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

        {/* Timeline Info */}
        {plan.timeline && (
          <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50/50 p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-900">
                Timeline
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs font-medium text-gray-500">
                  Estimated Completion
                </span>
                <p className="text-sm font-medium text-gray-900">
                  {plan.timeline.estimated_completion}
                </p>
              </div>
              {plan.timeline.critical_path?.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-gray-500">
                    Critical Path
                  </span>
                  <p className="text-sm text-gray-600">
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
