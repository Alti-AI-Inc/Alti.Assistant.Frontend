'use client';

import React, { useState, useEffect } from 'react';
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

import TaskInboxPanel, { TaskRun } from './_components/TaskInboxPanel';
import TaskHistoryLogs from './_components/TaskHistoryLogs';

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
  const [prompt, setPrompt] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('one-time');
  const [triggerType, setTriggerType] = useState<TriggerType>('scheduled');
  const [scheduledTime, setScheduledTime] = useState('');
  const [eventTrigger, setEventTrigger] = useState('');

  const [tasks, setTasks] = useState<AutomationTask[]>([]);
  const [runs, setRuns] = useState<TaskRun[]>([]);
  
  const [isInboxOpen, setIsInboxOpen] = useState(true); // Open side-panel by default for side-by-side view
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [selectedLogTaskName, setSelectedLogTaskName] = useState('');

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
      setRuns(JSON.parse(savedRuns));
    } else {
      // Default runs
      const defaultRuns: TaskRun[] = [
        {
          id: 'run-1',
          taskName: 'Daily Report Summary',
          timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
          status: 'success',
          duration: 3200,
          summary: 'Generated daily GCP usage and cost optimization report. Compiled 4 recommendation metrics, reducing computed Vertex AI endpoint waste by 12%.',
        },
        {
          id: 'run-2',
          taskName: 'Email Auto-Responder',
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          status: 'success',
          duration: 2800,
          summary: 'Drafted context-aware auto-response to client query. Summarized action points and saved in Gmail Drafts (ID: d_10f8b3c84).',
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
      toast.info('Form cleared for a new task!');
    };

    window.addEventListener('alti_new_task_click', handleNewTaskClick);
    return () => {
      window.removeEventListener('alti_new_task_click', handleNewTaskClick);
    };
  }, []);

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
    setIsInboxOpen(true); // Ensure side-panel is open to see progress

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

  const handleViewLogs = (taskName: string) => {
    setSelectedLogTaskName(taskName);
    setIsLogsOpen(true);
  };

  const handleClearRuns = () => {
    saveRuns([]);
    toast.success('Run history cleared');
  };

  const activeRunsCount = runs.filter(r => r.status === 'running').length;

  return (
    <div className="flex h-full w-full bg-[#F5F5F7] dark:bg-zinc-950 flex-row overflow-hidden relative">
      
      {/* Main Centered Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 relative overflow-hidden h-full">

        {/* Creator Form */}
        <div className="w-full max-w-2xl flex flex-col items-center z-10">
          <h1 className="text-4xl font-medium tracking-tight text-center mb-8 text-gray-900 dark:text-white select-none">
            Create an Automated Task
          </h1>
          
          {/* Task Creator Form (White Card) */}
          <div className="w-full bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden flex flex-col transition-shadow">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the task you want the assistant to perform automatically..."
              className="min-h-[140px] border-none focus-visible:ring-0 resize-none bg-transparent px-6 pt-6 text-base placeholder:text-gray-400 dark:placeholder:text-zinc-500 text-gray-900 dark:text-white"
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

      {/* Persistent Collapsible Right Side Runs Inbox */}
      <TaskInboxPanel
        isOpen={isInboxOpen}
        runs={runs}
        onViewLogs={handleViewLogs}
        onClearRuns={handleClearRuns}
        onClose={() => setIsInboxOpen(false)}
        onOpen={() => setIsInboxOpen(true)}
      />

      {/* Terminal logs Modal */}
      <TaskHistoryLogs
        isOpen={isLogsOpen}
        onOpenChange={setIsLogsOpen}
        taskName={selectedLogTaskName}
      />
    </div>
  );
}
