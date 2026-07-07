'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Zap, 
  ArrowUp, 
  Repeat, 
  CalendarClock, 
  PanelRightClose
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface TaskRun {
  id: string;
  taskName: string;
  timestamp: string;
  status: 'running' | 'success' | 'failed';
  summary: string;
  duration?: number;
}

import TaskHistoryLogs from './_components/TaskHistoryLogs';
import { OPTIONS, useConversationsStore } from '@/stores/useConverstionsStore';

type TaskType = 'one-time' | 'recurring';
type TriggerType = 'scheduled' | 'event';

interface AutomationTask {
  id: string;
  prompt: string;
  taskType: TaskType;
  triggerType: TriggerType;
  schedule: string;
  event: string;
  active: boolean;
  createdAt: string;
}

export default function TasksClient() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isSpacesPage = pathname?.startsWith('/my-chatbots') || pathname?.startsWith('/knowledge/');
  const taskId = searchParams.get('taskId');
  const { selectedOption, setSelectedOption } = useConversationsStore();
  
  const [prompt, setPrompt] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('one-time');
  const [triggerType, setTriggerType] = useState<TriggerType>('scheduled');
  const [scheduledTime, setScheduledTime] = useState('');
  const [eventTrigger, setEventTrigger] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [tasks, setTasks] = useState<AutomationTask[]>([]);
  const [runs, setRuns] = useState<TaskRun[]>([]);
  
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [selectedLogTaskName, setSelectedLogTaskName] = useState('');
  const [selectedTaskTitleFilter, setSelectedTaskTitleFilter] = useState<string | null>(null);

  // Hydrate states from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('alti_automations');
    const savedRuns = localStorage.getItem('alti_task_runs');

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Default tasks
      const defaultTasks: AutomationTask[] = [
        {
          id: 'task-1',
          prompt: 'Audit and summarize GCP cost reports from Vertex AI and compile an automated markdown daily usage summary.',
          taskType: 'recurring',
          triggerType: 'scheduled',
          schedule: 'Every day at 9 AM',
          event: '',
          active: true,
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: 'task-2',
          prompt: 'Summarize key questions in the incoming client email, draft a professional response draft matching our brand guidelines, and save it in drafts.',
          taskType: 'recurring',
          triggerType: 'event',
          schedule: '',
          event: 'When a new email arrives from @client.com',
          active: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'task-3',
          prompt: 'Generate Q2 earnings call market summary report and compile comparison charts against competitor benchmarks.',
          taskType: 'one-time',
          triggerType: 'scheduled',
          schedule: 'Tomorrow at 3 PM',
          event: '',
          active: true,
          createdAt: new Date().toISOString(),
        }
      ];
      setTasks(defaultTasks);
      localStorage.setItem('alti_automations', JSON.stringify(defaultTasks));
    }

    if (savedRuns) {
      try {
        const parsed = JSON.parse(savedRuns);
        const hasOldFormat = parsed.some((r: any) => r.taskName === 'Daily Report Summary' || r.taskName === 'Email Auto-Responder');
        if (parsed.length === 0 || hasOldFormat) {
          const defaultRuns: TaskRun[] = [
            {
              id: 'run-1',
              taskName: 'Audit and summarize GCP cost rep...',
              timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
              status: 'success',
              duration: 3200,
              summary: 'Generated daily GCP usage and cost optimization report. Compiled 4 recommendation metrics, reducing computed Vertex AI endpoint waste by 12%.',
            },
            {
              id: 'run-2',
              taskName: 'Summarize key questions in the in...',
              timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
              status: 'success',
              duration: 2800,
              summary: 'Drafted context-aware auto-response to client query. Summarized action points and saved in Gmail Drafts (ID: d_10f8b3c84).',
            },
            {
              id: 'run-3',
              taskName: 'Generate Q2 earnings call market su...',
              timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
              status: 'success',
              duration: 4100,
              summary: 'Compiled Q2 earnings call market summary report. Generated comparative tables and performance charts against competitor metrics.',
            }
          ];
          setRuns(defaultRuns);
          localStorage.setItem('alti_task_runs', JSON.stringify(defaultRuns));
        } else {
          setRuns(parsed);
        }
      } catch (e) {
        // Fallback if parsing failed
        const defaultRuns: TaskRun[] = [
          {
            id: 'run-1',
            taskName: 'Audit and summarize GCP cost rep...',
            timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
            status: 'success',
            duration: 3200,
            summary: 'Generated daily GCP usage and cost optimization report. Compiled 4 recommendation metrics, reducing computed Vertex AI endpoint waste by 12%.',
          },
          {
            id: 'run-2',
            taskName: 'Summarize key questions in the in...',
            timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
            status: 'success',
            duration: 2800,
            summary: 'Drafted context-aware auto-response to client query. Summarized action points and saved in Gmail Drafts (ID: d_10f8b3c84).',
          },
          {
            id: 'run-3',
            taskName: 'Generate Q2 earnings call market su...',
            timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
            status: 'success',
            duration: 4100,
            summary: 'Compiled Q2 earnings call market summary report. Generated comparative tables and performance charts against competitor metrics.',
          }
        ];
        setRuns(defaultRuns);
        localStorage.setItem('alti_task_runs', JSON.stringify(defaultRuns));
      }
    } else {
      // Default runs matching the default tasks
      const defaultRuns: TaskRun[] = [
        {
          id: 'run-1',
          taskName: 'Audit and summarize GCP cost rep...',
          timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
          status: 'success',
          duration: 3200,
          summary: 'Generated daily GCP usage and cost optimization report. Compiled 4 recommendation metrics, reducing computed Vertex AI endpoint waste by 12%.',
        },
        {
          id: 'run-2',
          taskName: 'Summarize key questions in the in...',
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          status: 'success',
          duration: 2800,
          summary: 'Drafted context-aware auto-response to client query. Summarized action points and saved in Gmail Drafts (ID: d_10f8b3c84).',
        },
        {
          id: 'run-3',
          taskName: 'Generate Q2 earnings call market su...',
          timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
          status: 'success',
          duration: 4100,
          summary: 'Compiled Q2 earnings call market summary report. Generated comparative tables and performance charts against competitor metrics.',
        }
      ];
      setRuns(defaultRuns);
      localStorage.setItem('alti_task_runs', JSON.stringify(defaultRuns));
    }
  }, []);

  // Listen to new task trigger from sidebar
  useEffect(() => {
    const handleNewTaskClick = () => {
      setPrompt('');
      setScheduledTime('');
      setEventTrigger('');
      setEditingTaskId(null);
      setSelectedTaskTitleFilter(null);
      window.history.replaceState(null, '', '/tasks');
    };

    window.addEventListener('alti_new_task_click', handleNewTaskClick);
    return () => {
      window.removeEventListener('alti_new_task_click', handleNewTaskClick);
    };
  }, []);

  // Sync state when taskId parameter changes
  useEffect(() => {
    if (!taskId || tasks.length === 0) {
      setSelectedTaskTitleFilter(null);
      return;
    }
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setPrompt(task.prompt);
      setTaskType(task.taskType);
      setTriggerType(task.triggerType);
      if (task.triggerType === 'scheduled') {
        setScheduledTime(task.schedule);
        setEventTrigger('');
      } else {
        setEventTrigger(task.event);
        setScheduledTime('');
      }
      setEditingTaskId(task.id);
      
      const taskTitle = task.prompt.length > 35 ? task.prompt.slice(0, 35) + '...' : task.prompt;
      setSelectedTaskTitleFilter(taskTitle);
    }
  }, [taskId, tasks]);

  const saveTasks = (newTasks: AutomationTask[]) => {
    setTasks(newTasks);
    localStorage.setItem('alti_automations', JSON.stringify(newTasks));
    window.dispatchEvent(new Event('alti_automations_updated'));
  };

  const saveRuns = (newRuns: TaskRun[]) => {
    setRuns(newRuns);
    localStorage.setItem('alti_task_runs', JSON.stringify(newRuns));
  };

  const handleCreateTask = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a task prompt.');
      return;
    }

    if (editingTaskId) {
      const updatedTasks = tasks.map(t => t.id === editingTaskId ? {
        ...t,
        prompt: prompt.trim(),
        taskType,
        triggerType,
        schedule: triggerType === 'scheduled' ? scheduledTime || 'Every hour' : '',
        event: triggerType === 'event' ? eventTrigger || 'When trigger matches' : '',
      } : t);
      saveTasks(updatedTasks);
      toast.success('Task updated successfully!');
      setEditingTaskId(null);
      setPrompt('');
      setScheduledTime('');
      setEventTrigger('');
      window.history.replaceState(null, '', '/tasks');
      return;
    }

    const newTask: AutomationTask = {
      id: `task-${Date.now()}`,
      prompt: prompt.trim(),
      taskType,
      triggerType,
      schedule: triggerType === 'scheduled' ? scheduledTime || 'Every hour' : '',
      event: triggerType === 'event' ? eventTrigger || 'When trigger matches' : '',
      active: true,
      createdAt: new Date().toISOString(),
    };

    saveTasks([newTask, ...tasks]);
    
    toast.success('Task created successfully!', {
      description: `Your ${taskType} task will be triggered by ${triggerType}.`
    });

    // Automatically trigger the run simulation
    const runId = `run-${Date.now()}`;
    const taskTitle = newTask.prompt.length > 35 ? newTask.prompt.slice(0, 35) + '...' : newTask.prompt;
    
    const newRun: TaskRun = {
      id: runId,
      taskName: taskTitle,
      timestamp: new Date().toISOString(),
      status: 'running',
      summary: 'Task is executing in background environment...',
    };

    saveRuns([newRun, ...runs]);

    setTimeout(() => {
      let finalSummary = 'Successfully executed automated agent run. Output: Completed all actions specified in the prompt.';
      const p = newTask.prompt.toLowerCase();
      if (p.includes('gcp') || p.includes('cost') || p.includes('report')) {
        finalSummary = 'Generated daily GCP usage and cost optimization report. Compiled 4 recommendation metrics, reducing computed Vertex AI endpoint waste by 12%.';
      } else if (p.includes('email') || p.includes('reply') || p.includes('responder')) {
        finalSummary = 'Drafted context-aware auto-response to client query. Summarized action points and saved in Gmail Drafts (ID: d_10f8b3c84).';
      } else if (p.includes('storage') || p.includes('database') || p.includes('audit')) {
        finalSummary = 'Completed database cleanup run. Purged 1,402 expired session tokens and reclaimed 4.2 GB of temporary storage.';
      }

      setRuns(prevRuns => {
        const updated = prevRuns.map(r => r.id === runId ? {
          ...r,
          status: 'success' as const,
          duration: 2000 + Math.floor(Math.random() * 2000),
          summary: finalSummary,
        } : r);
        localStorage.setItem('alti_task_runs', JSON.stringify(updated));
        return updated;
      });

      toast.success(`Automation run complete!`, {
        description: `Task: ${taskTitle}`
      });
    }, 3000);
    
    setPrompt('');
    setScheduledTime('');
    setEventTrigger('');
  };

  const handleEditTask = (task: AutomationTask) => {
    setEditingTaskId(task.id);
    setPrompt(task.prompt);
    setTaskType(task.taskType);
    setTriggerType(task.triggerType);
    setScheduledTime(task.schedule);
    setEventTrigger(task.event);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    saveTasks(updated);
    toast.success('Task deleted successfully');
    if (editingTaskId === id) {
      setEditingTaskId(null);
      setPrompt('');
      setScheduledTime('');
      setEventTrigger('');
    }
  };

  const handleViewLogs = (taskName: string) => {
    setSelectedLogTaskName(taskName);
    setIsLogsOpen(true);
  };

  const handleClearRuns = () => {
    saveRuns([]);
    toast.success('Run history cleared');
  };

  const activeRunsCount = runs.filter(r => r.status === 'running').length;

  if (isSpacesPage) {
    return (
      <div className="flex h-full w-full bg-[#e1e1e1] dark:bg-zinc-955 flex-col overflow-hidden relative">
        {/* Main Content Area: Tasks List */}
        <div className="flex-1 w-full overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col items-center min-h-0">
          <div className="w-full max-w-[796px] flex-1 flex flex-col min-h-0 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Active Tasks</span>
              {activeRunsCount > 0 && (
                <span className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2.5 py-1 rounded-full font-medium">
                  <span className="size-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse" />
                  {activeRunsCount} run{activeRunsCount > 1 ? 's' : ''} active
                </span>
              )}
            </div>
            
            {/* Scrollable Tasks List */}
            <div className="flex-1 overflow-y-auto">
              {tasks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 select-none">
                  <div className="size-12 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 flex items-center justify-center border border-black/5 dark:border-white/5 mb-4">
                    <Repeat className="size-6 text-gray-400 dark:text-zinc-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No automated tasks</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-xs leading-relaxed">
                    Describe the task you want to run in the prompt box below to automate your workspace.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-black/5 dark:divide-white/5">
                  {tasks.map((task) => (
                    <div 
                      key={task.id} 
                      onClick={() => setSelectedTaskTitleFilter(selectedTaskTitleFilter === task.prompt ? null : task.prompt)}
                      className={cn(
                        "p-4 hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors flex items-start justify-between gap-4 cursor-pointer",
                        selectedTaskTitleFilter === task.prompt ? "bg-gray-50/30 dark:bg-zinc-800/10" : ""
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white break-words line-clamp-2">
                          {task.prompt}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider",
                            task.taskType === 'recurring' 
                              ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200/30 dark:border-amber-900/20"
                              : "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-200/30 dark:border-blue-900/20"
                          )}>
                            {task.taskType}
                          </span>
                          
                          <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-mono">
                            {task.triggerType === 'scheduled' ? `Schedule: ${task.schedule}` : `Trigger: ${task.event}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => handleEditTask(task)}
                          className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                        >
                          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Input Area: Parent Toggle + Creator Form */}
        <div className="shrink-0 w-full px-4 sm:px-6 lg:px-8 pb-4 pt-2 bg-transparent mt-auto flex flex-col items-center">
          <div className="w-full max-w-[796px]">
            {/* Parent Toggle */}
            <div className="mb-4 flex justify-center">
              <div className="flex bg-white dark:bg-zinc-900/80 backdrop-blur-md p-1 rounded-full shadow-sm border border-gray-200/50 dark:border-zinc-800/50">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOption(null); // Auto select 'Search'
                  }}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  AI
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOption(OPTIONS.CODE); // Auto select 'Code'
                  }}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  Studio
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOption(OPTIONS.TASK); // Auto select 'Task Automation'
                  }}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                >
                  Tasks
                </button>
              </div>
            </div>
            
            {/* Task Creator Form (Styled exactly like ChatInput) */}
            <div className="w-full bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-shadow">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the task you want to automate..."
                className="min-h-[72px] border-none focus-visible:ring-0 resize-none bg-transparent px-4 pt-4 text-base placeholder:text-gray-400 dark:placeholder:text-zinc-550 text-gray-900 dark:text-white"
              />

              <div className="px-4 pb-4 pt-1">
                <div className="flex flex-col gap-3">
                  
                  {/* Controls Toggle Row */}
                  <div className="flex flex-wrap items-center gap-3">
                    
                    {/* Task Type Switcher */}
                    <div className="flex bg-gray-100 dark:bg-zinc-950 p-1 rounded-xl border border-black/5 dark:border-zinc-800/80">
                      <button
                        type="button"
                        onClick={() => setTaskType('one-time')}
                        className={cn(
                          'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5',
                          taskType === 'one-time'
                            ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        )}
                      >
                        <Clock className="size-3.5" />
                        One-time
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaskType('recurring')}
                        className={cn(
                          'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5',
                          taskType === 'recurring'
                            ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        )}
                      >
                        <Repeat className="size-3.5" />
                        Recurring
                      </button>
                    </div>

                    {/* Trigger Type Switcher */}
                    <div className="flex bg-gray-100 dark:bg-zinc-955 p-1 rounded-xl border border-black/5 dark:border-zinc-800/80">
                      <button
                        type="button"
                        onClick={() => setTriggerType('scheduled')}
                        className={cn(
                          'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5',
                          triggerType === 'scheduled'
                            ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        )}
                      >
                        <CalendarClock className="size-3.5" />
                        Scheduled
                      </button>
                      <button
                        type="button"
                        onClick={() => setTriggerType('event')}
                        className={cn(
                          'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5',
                          triggerType === 'event'
                            ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        )}
                      >
                        <Zap className="size-3.5" />
                        Event
                      </button>
                    </div>

                  </div>

                  {/* Input Row */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      {triggerType === 'scheduled' ? (
                        <input
                          type="text"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          placeholder={taskType === 'recurring' ? 'Cron expression (e.g. Every Monday at 9AM)' : 'Execution time (e.g. Tomorrow 3PM)'}
                          className="w-full bg-gray-50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                      ) : (
                        <input
                          type="text"
                          value={eventTrigger}
                          onChange={(e) => setEventTrigger(e.target.value)}
                          placeholder="Trigger event (e.g. When a new email arrives from @client.com)"
                          className="w-full bg-gray-50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                      )}
                    </div>
                    
                    {editingTaskId && (
                      <Button 
                        variant="ghost"
                        onClick={() => {
                          setEditingTaskId(null);
                          setPrompt('');
                          setScheduledTime('');
                          setEventTrigger('');
                          window.history.replaceState(null, '', '/tasks');
                          toast.info('Edit cancelled');
                        }}
                        className="text-xs text-zinc-500 hover:text-gray-900 dark:hover:text-white px-2 h-[36px]"
                      >
                        Cancel
                      </Button>
                    )}
                    
                    <Button 
                      onClick={handleCreateTask}
                      disabled={!prompt.trim()}
                      className="bg-black hover:bg-black/90 disabled:bg-black disabled:opacity-100 text-white rounded-xl h-[36px] w-[36px] p-0 flex items-center justify-center transition-transform active:scale-95 disabled:active:scale-100"
                    >
                      <ArrowUp className="size-4 text-white" />
                    </Button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal logs Modal */}
        <TaskHistoryLogs
          isOpen={isLogsOpen}
          onOpenChange={setIsLogsOpen}
          taskName={selectedLogTaskName}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-[#e1e1e1] dark:bg-zinc-950 flex-row overflow-hidden relative">
      
      {/* Main Centered Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 relative overflow-hidden h-full">

        {/* Creator Form */}
        <div className="w-full max-w-2xl flex flex-col items-center z-10">
          {isSpacesPage ? (
            <div className="mb-8 flex justify-center">
              <div className="flex bg-white dark:bg-zinc-900/80 backdrop-blur-md p-1 rounded-full shadow-sm border border-gray-200/50 dark:border-zinc-800/50">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOption(null); // Auto select 'Search'
                  }}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  AI
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOption(OPTIONS.CODE); // Auto select 'Code'
                  }}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  Studio
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOption(OPTIONS.TASK); // Auto select 'Task Automation'
                  }}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                >
                  Tasks
                </button>
              </div>
            </div>
          ) : (
            <h1 className="text-4xl font-medium tracking-tight text-center mb-8 text-gray-900 dark:text-white select-none">
              {editingTaskId ? 'Edit Automated Task' : 'Create Automated Task'}
            </h1>
          )}
          
          {/* Task Creator Form (White Card) */}
          <div className="w-full bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden flex flex-col transition-shadow">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the task you want to automate..."
              className="min-h-[72px] border-none focus-visible:ring-0 resize-none bg-transparent px-6 pt-6 text-base placeholder:text-gray-400 dark:placeholder:text-zinc-500 text-gray-900 dark:text-white"
            />

            <div className="px-5 pb-5 pt-2">
              <div className="flex flex-col gap-4">
                
                {/* Controls Toggle Row */}
                <div className="flex flex-wrap items-center gap-3">
                  
                  {/* Task Type Switcher */}
                  <div className="flex bg-gray-100 dark:bg-zinc-950 p-1 rounded-xl border border-black/5 dark:border-zinc-800/80">
                    <button
                      type="button"
                      onClick={() => setTaskType('one-time')}
                      className={cn(
                        'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5',
                        taskType === 'one-time'
                          ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      )}
                    >
                      <Clock className="size-3.5" />
                      One-time
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaskType('recurring')}
                      className={cn(
                        'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5',
                        taskType === 'recurring'
                          ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      )}
                    >
                      <Repeat className="size-3.5" />
                      Recurring
                    </button>
                  </div>

                  {/* Trigger Type Switcher */}
                  <div className="flex bg-gray-100 dark:bg-zinc-950 p-1 rounded-xl border border-black/5 dark:border-zinc-800/80">
                    <button
                      type="button"
                      onClick={() => setTriggerType('scheduled')}
                      className={cn(
                        'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5',
                        triggerType === 'scheduled'
                          ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      )}
                    >
                      <CalendarClock className="size-3.5" />
                      Scheduled
                    </button>
                    <button
                      type="button"
                      onClick={() => setTriggerType('event')}
                      className={cn(
                        'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5',
                        triggerType === 'event'
                          ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      )}
                    >
                      <Zap className="size-3.5" />
                      Event
                    </button>
                  </div>

                </div>

                {/* Input Row */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    {triggerType === 'scheduled' ? (
                      <input
                        type="text"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        placeholder={taskType === 'recurring' ? 'Cron expression (e.g. Every Monday at 9AM)' : 'Execution time (e.g. Tomorrow 3PM)'}
                        className="w-full bg-gray-50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    ) : (
                      <input
                        type="text"
                        value={eventTrigger}
                        onChange={(e) => setEventTrigger(e.target.value)}
                        placeholder="Trigger event (e.g. When a new email arrives from @client.com)"
                        className="w-full bg-gray-50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    )}
                  </div>
                  
                  {editingTaskId && (
                    <Button 
                      variant="ghost"
                      onClick={() => {
                        setEditingTaskId(null);
                        setPrompt('');
                        setScheduledTime('');
                        setEventTrigger('');
                        window.history.replaceState(null, '', '/tasks');
                        toast.info('Edit cancelled');
                      }}
                      className="text-xs text-zinc-550 hover:text-gray-900 dark:hover:text-white"
                    >
                      Cancel
                    </Button>
                  )}
                  
                  <Button 
                    onClick={handleCreateTask}
                    disabled={!prompt.trim()}
                    className="bg-black hover:bg-black/90 disabled:bg-black disabled:opacity-100 text-white rounded-xl h-[42px] w-[42px] p-0 flex items-center justify-center transition-transform active:scale-95 disabled:active:scale-100"
                  >
                    <ArrowUp className="size-5 text-white" />
                  </Button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Terminal logs Modal */}
      <TaskHistoryLogs
        isOpen={isLogsOpen}
        onOpenChange={setIsLogsOpen}
        taskName={selectedLogTaskName}
      />
    </div>
  );
}
