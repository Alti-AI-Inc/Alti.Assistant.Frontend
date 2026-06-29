'use client';

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Clock, Zap, ArrowUp, Repeat, CalendarClock, Globe, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter, usePathname } from 'next/navigation';

type TaskType = 'one-time' | 'recurring';
type TriggerType = 'scheduled' | 'event';

export default function TasksClient() {
  const router = useRouter();
  const pathname = usePathname();
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
    
    toast.success('Task created successfully!', {
      description: `Your ${taskType} task will be triggered by ${triggerType}.`
    });
    
    setPrompt('');
    setScheduledTime('');
    setEventTrigger('');
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-zinc-950 items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Create an Automated Task
        </h1>
        
        {/* Main Tab Toggle */}
        <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl mb-4 self-center w-fit mx-auto shadow-xs border border-black/5 dark:border-white/5">
          <button
            type="button"
            onClick={() => {
              if (pathname !== '/' && !pathname.startsWith('/c/')) {
                router.push('/');
              }
            }}
            className={cn(
              'px-4 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2',
              (pathname === '/' || pathname.startsWith('/c/'))
                ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            )}
          >
            <Globe className="size-4" />
            Chat
          </button>
          <button
            type="button"
            onClick={() => {
              if (pathname !== '/my-chatbots' && !pathname.startsWith('/my-chatbots')) {
                router.push('/my-chatbots');
              }
            }}
            className={cn(
              'px-4 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2',
              (pathname === '/my-chatbots' || pathname.startsWith('/my-chatbots'))
                ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            )}
          >
            <LayoutGrid className="size-4" />
            Spaces
          </button>
          <button
            type="button"
            onClick={() => {
              router.push('/tasks');
            }}
            className={cn(
              'px-4 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2',
              (pathname === '/tasks' || pathname.startsWith('/tasks'))
                ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            )}
          >
            <Zap className="size-4" />
            Tasks
          </button>
        </div>

        {/* Main Prompt Box Container */}
        <div className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-3xl shadow-sm overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-indigo-500/50 transition-shadow">
          
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the task you want the assistant to perform automatically..."
            className="min-h-[160px] border-none focus-visible:ring-0 resize-none bg-transparent px-6 pt-6 text-lg placeholder:text-gray-400 dark:placeholder:text-zinc-500"
          />

          <div className="px-4 pb-4 pt-2">
            {/* Options Area */}
            <div className="flex flex-col gap-3">
              
              {/* Settings Row */}
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Task Type Toggle */}
                <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setTaskType('one-time')}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5',
                      taskType === 'one-time'
                        ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
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
                      'px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5',
                      taskType === 'recurring'
                        ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    )}
                  >
                    <Repeat className="size-3.5" />
                    Recurring
                  </button>
                </div>

                {/* Trigger Type Toggle */}
                <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setTriggerType('scheduled')}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5',
                      triggerType === 'scheduled'
                        ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
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
                      'px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5',
                      triggerType === 'event'
                        ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    )}
                  >
                    <Zap className="size-3.5" />
                    Event
                  </button>
                </div>

              </div>

              {/* Dynamic Input Row */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  {triggerType === 'scheduled' ? (
                    <input
                      type="text"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      placeholder={taskType === 'recurring' ? 'Cron expression (e.g. Every Monday at 9AM)' : 'Execution time (e.g. Tomorrow 3PM)'}
                      className="w-full bg-gray-50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  ) : (
                    <input
                      type="text"
                      value={eventTrigger}
                      onChange={(e) => setEventTrigger(e.target.value)}
                      placeholder="Trigger event (e.g. When a new email arrives from @client.com)"
                      className="w-full bg-gray-50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  )}
                </div>
                
                {/* Submit Button */}
                <Button 
                  onClick={handleCreateTask}
                  disabled={!prompt.trim()}
                  className="bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-white/90 text-white dark:text-black rounded-xl h-[42px] w-[42px] p-0 flex items-center justify-center transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                >
                  <ArrowUp className="size-5" />
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
