'use client';

export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Plus,
  Play,
  Zap,
  GitBranch,
  ArrowRight,
  Clock,
  CheckCircle2,
  PauseCircle,
  AlertCircle,
  Search,
  Settings,
  Database,
  Cpu,
  Workflow
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowItem {
  id: string;
  name: string;
  description: string;
  trigger: string;
  status: 'active' | 'paused' | 'error';
  lastRun: string;
  successRate: string;
  apps: string[];
  stepsCount: number;
  icon: string;
  category: 'research' | 'dev' | 'sales' | 'support';
}

const INITIAL_WORKFLOWS: WorkflowItem[] = [
  {
    id: 'wf-1',
    name: 'Daily Market Intel & Slack Report',
    description: 'Autonomous swarm researches crypto & L1 trends every morning, compiles a report, and sends it to the #intel Slack channel.',
    trigger: 'Cron: Every Day at 8:00 AM',
    status: 'active',
    lastRun: '10 minutes ago',
    successRate: '100%',
    apps: ['🌐', '💬', '🤖'],
    stepsCount: 4,
    icon: '📊',
    category: 'research'
  },
  {
    id: 'wf-2',
    name: 'Codebase Vulnerability Scan',
    description: 'Triggered on new commits. Scrapes changed files for secrets, filters against active CVE lists, and drafts pull request comments.',
    trigger: 'Webhook: on git push',
    status: 'active',
    lastRun: '2 hours ago',
    successRate: '98.5%',
    apps: ['🐙', '🤖', '📄'],
    stepsCount: 3,
    icon: '🛡️',
    category: 'dev'
  },
  {
    id: 'wf-3',
    name: 'Autonomous Sales Prospecting Flow',
    description: 'Ingests new leads from Notion databases, performs Google searches on their enterprise domain, and creates a tailored email draft.',
    trigger: 'Database: Notion New Row',
    status: 'paused',
    lastRun: 'Yesterday',
    successRate: '96.2%',
    apps: ['📓', '🌐', '✉️', '🤖'],
    stepsCount: 5,
    icon: '🎯',
    category: 'sales'
  },
  {
    id: 'wf-4',
    name: 'Support Mail Auto-Draft Swarm',
    description: 'Analyzes support inbox emails, executes a semantic search over internal document indexes, and auto-drafts responses for review.',
    trigger: 'Email: on new message',
    status: 'active',
    lastRun: '1 hour ago',
    successRate: '99.1%',
    apps: ['✉️', '☁️', '🤖'],
    stepsCount: 4,
    icon: '✉️',
    category: 'support'
  }
];

function WorkflowsDashboardContent() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(INITIAL_WORKFLOWS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const toggleWorkflowStatus = (id: string) => {
    setWorkflows(prev =>
      prev.map(wf => {
        if (wf.id === id) {
          const newStatus = wf.status === 'active' ? 'paused' : 'active';
          return { ...wf, status: newStatus };
        }
        return wf;
      })
    );
  };

  const handleRunNow = (id: string) => {
    alert(`Triggering live manual execution for Workflow: ${workflows.find(w => w.id === id)?.name}`);
  };

  const filteredWorkflows = workflows.filter(wf => {
    const matchesSearch = wf.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          wf.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || wf.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 p-8 text-white shadow-xl flex items-center justify-between">
        <div className="space-y-3 max-w-lg z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
            <Zap className="h-3.5 w-3.5 fill-current text-yellow-300 animate-pulse" /> Agentic Automations
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Automate Your Intelligence</h1>
          <p className="text-sm text-indigo-100 leading-relaxed font-medium">
            Establish event-driven or scheduled workflows that coordinate custom agents, RAG document indexes, and enterprise apps in the background.
          </p>
        </div>
        <div className="hidden lg:block text-white/10 absolute -right-12 -bottom-12 scale-150 transform">
          <Workflow className="h-56 w-56 stroke-[1px]" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Workflows', value: workflows.length, icon: GitBranch, color: 'text-indigo-600' },
          { label: 'Active Tasks', value: workflows.filter(w => w.status === 'active').length, icon: Zap, color: 'text-amber-500' },
          { label: 'Completed Runs', value: '1,842', icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'Avg Success Rate', value: '98.4%', icon: Cpu, color: 'text-sky-500' }
        ].map((stat, i) => (
          <Card key={i} className="p-4 flex items-center gap-4 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-2xs">
            <div className={cn("p-2 rounded-xl bg-gray-50 dark:bg-gray-900", stat.color)}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-1.5 w-full sm:max-w-xs shadow-2xs">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs w-full text-gray-900 dark:text-gray-100 placeholder:text-gray-500"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'research', label: 'Research' },
            { id: 'dev', label: 'Developer' },
            { id: 'sales', label: 'Sales' },
            { id: 'support', label: 'Support' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap",
                filterCategory === cat.id
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {filteredWorkflows.map((wf) => (
          <Card
            key={wf.id}
            className="p-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex items-start gap-4 min-w-0 flex-1">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/10 text-2xl border border-black/5 shadow-2xs">
                {wf.icon}
              </div>
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-gray-50 truncate">
                    {wf.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full capitalize",
                      wf.status === 'active' && "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
                      wf.status === 'paused' && "bg-gray-500/10 border-gray-500/30 text-gray-500",
                      wf.status === 'error' && "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                    )}
                  >
                    {wf.status === 'active' ? 'Active' : wf.status === 'paused' ? 'Paused' : 'Error'}
                  </Badge>
                  <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 dark:bg-gray-900 border border-gray-150 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {wf.trigger}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
                  {wf.description}
                </p>
                <div className="flex items-center gap-4 pt-2 text-[10px] font-semibold text-gray-400 flex-wrap">
                  <span>Last executed: <strong className="text-gray-700 dark:text-gray-300">{wf.lastRun}</strong></span>
                  <span className="h-3 w-px bg-gray-250 dark:bg-gray-800" />
                  <span>Success rate: <strong className="text-emerald-600 dark:text-emerald-400">{wf.successRate}</strong></span>
                  <span className="h-3 w-px bg-gray-250 dark:bg-gray-800" />
                  <span>Steps: <strong className="text-indigo-600 dark:text-indigo-400">{wf.stepsCount} steps</strong></span>
                  <span className="h-3 w-px bg-gray-250 dark:bg-gray-800" />
                  <div className="flex items-center gap-1.5">
                    <span>Connected Apps:</span>
                    <div className="flex items-center gap-1">
                      {wf.apps.map((app, i) => (
                        <span key={i} className="flex h-5 w-5 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-xs border border-black/5" title="Connected App">
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Toggles */}
            <div className="flex items-center gap-3 border-t md:border-t-0 border-gray-100 dark:border-gray-800 pt-4 md:pt-0 justify-end flex-none">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRunNow(wf.id)}
                disabled={wf.status !== 'active'}
                className="h-8 text-xs font-bold rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-1 cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" /> Run Now
              </Button>
              <button
                type="button"
                onClick={() => toggleWorkflowStatus(wf.id)}
                className={cn(
                  "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  wf.status === 'active' ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-800"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                    wf.status === 'active' ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </Card>
        ))}

        {filteredWorkflows.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500 bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xs">
            No workflows found.
          </div>
        )}

        {/* Dotted Create Card */}
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-850 p-8 text-center hover:border-indigo-500 hover:bg-indigo-500/[0.01] transition-all cursor-pointer group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
            <Plus className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-bold text-gray-950 dark:text-gray-50 text-sm">Create New Workflow Automation</h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 max-w-sm">
            Define triggers (Cron/Webhook), chain agents to analyze inputs, query vector indexes, and launch external actions automatically.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function WorkflowsDashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500 font-semibold text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          Loading Workflows Dashboard...
        </div>
      </div>
    }>
      <WorkflowsDashboardContent />
    </Suspense>
  );
}
