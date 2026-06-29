'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Clock, Zap, PlusCircle, CheckCircle2, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type TaskType = 'one-time' | 'recurring';
type TriggerType = 'scheduled' | 'event';

export default function TasksClient() {
  const [prompt, setPrompt] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('one-time');
  const [triggerType, setTriggerType] = useState<TriggerType>('scheduled');
  
  const [scheduledTime, setScheduledTime] = useState('');
  const [eventTrigger, setEventTrigger] = useState('');

  const handleCreateTask = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a task prompt.');
      return;
    }
    
    // In a real app, send this to the backend
    toast.success('Task created successfully!', {
      description: `Your ${taskType} task will be triggered by ${triggerType}.`
    });
    
    // Reset form
    setPrompt('');
    setScheduledTime('');
    setEventTrigger('');
  };

  return (
    <div className="flex h-full flex-col bg-[#F9FAFB] dark:bg-zinc-950 overflow-y-auto">
      {/* Header Area */}
      <div className="border-b border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 px-8 py-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ListTodo className="size-6 text-indigo-600 dark:text-indigo-400" />
              Automated Tasks
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Create prompt-based actions to run on a schedule or event trigger.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gray-50/50 dark:bg-zinc-900/50 border-b border-black/5 dark:border-white/5 pb-6">
              <CardTitle className="text-xl">Create New Task</CardTitle>
              <CardDescription>
                Define what the assistant should do and when it should happen.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              
              {/* Prompt Input */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                  Task Instructions
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Draft a weekly summary report from my unread emails and save it to Google Drive..."
                  className="min-h-[120px] resize-none bg-gray-50 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500 rounded-xl p-4 text-base"
                />
              </div>

              {/* Task Type Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Task Frequency */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                    Task Frequency
                  </label>
                  <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setTaskType('one-time')}
                      className={cn(
                        'flex-1 py-2 text-sm font-medium rounded-lg transition-all',
                        taskType === 'one-time'
                          ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      )}
                    >
                      One-time
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaskType('recurring')}
                      className={cn(
                        'flex-1 py-2 text-sm font-medium rounded-lg transition-all',
                        taskType === 'recurring'
                          ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      )}
                    >
                      Recurring
                    </button>
                  </div>
                </div>

                {/* Trigger Type */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                    Trigger Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTriggerType('scheduled')}
                      className={cn(
                        'flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all',
                        triggerType === 'scheduled'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-300'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-400 dark:hover:bg-zinc-800'
                      )}
                    >
                      <Clock className="size-4" />
                      Scheduled
                    </button>
                    <button
                      type="button"
                      onClick={() => setTriggerType('event')}
                      className={cn(
                        'flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all',
                        triggerType === 'event'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-300'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-400 dark:hover:bg-zinc-800'
                      )}
                    >
                      <Zap className="size-4" />
                      Event Trigger
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Settings based on Trigger */}
              <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-xl p-5 border border-black/5 dark:border-white/5">
                {triggerType === 'scheduled' ? (
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                      {taskType === 'recurring' ? 'Cron Expression or Schedule' : 'Execution Time'}
                    </label>
                    <input
                      type="text"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      placeholder={taskType === 'recurring' ? 'e.g. Every Monday at 9:00 AM' : 'e.g. Tomorrow at 3:00 PM'}
                      className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-gray-500">
                      Natural language scheduling is supported.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                      Trigger Event
                    </label>
                    <input
                      type="text"
                      value={eventTrigger}
                      onChange={(e) => setEventTrigger(e.target.value)}
                      placeholder="e.g. When a new email arrives from @client.com"
                      className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-gray-500">
                      Describe the event that should initiate this task.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Action */}
              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={handleCreateTask}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-5 shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <CheckCircle2 className="size-5" />
                  <span className="font-semibold text-base">Create Task</span>
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
