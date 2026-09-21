import { useState } from 'react';
import { toast } from 'sonner';
import { storage, STORAGE_KEYS } from '@/lib/storage';

interface UseTaskCreationProps {
  message: string;
  data: { accessToken?: string } | null | undefined;
  onOpen: (modal: { type: ModalType; actionId?: string }) => void;
  setMessage: (message: string) => void;
  stopListening: () => void;
  activeBotId?: string | null;
}

export function useTaskCreation({
  message,
  data,
  onOpen,
  setMessage,
  stopListening,
  activeBotId,
}: UseTaskCreationProps) {
  const [taskType, setTaskType] = useState<'one-time' | 'recurring'>('one-time');
  const [triggerType, setTriggerType] = useState<'scheduled' | 'event'>('scheduled');
  const [scheduledTime, setScheduledTime] = useState('');
  const [eventTrigger, setEventTrigger] = useState('');

  const handleCreateTask = () => {
    stopListening();

    if (!message.trim()) return;

    if (!data?.accessToken) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pending_prompt', message.trim());
      }
      onOpen({ type: 'auth-modal', actionId: 'register' });
      return;
    }

    const taskName = message.trim();
    const runId = Math.random().toString(36).substring(7);
    const newRun = {
      id: runId,
      taskName,
      timestamp: new Date().toISOString(),
      status: 'running' as const,
      summary: `Initiating workflow: "${taskName}" using triggers: [Type: ${taskType}, Trigger: ${triggerType === 'scheduled' ? scheduledTime : eventTrigger}]`,
      botId: activeBotId || undefined,
    };

    interface TaskRunRecord {
      id: string;
      taskName: string;
      timestamp: string;
      status: string;
      summary: string;
      botId?: string;
      duration?: number;
    }

    const runsList = storage.get<TaskRunRecord[]>(STORAGE_KEYS.TASK_RUNS) || [];
    runsList.unshift(newRun);
    storage.set(STORAGE_KEYS.TASK_RUNS, runsList);

    toast.success('Task scheduled successfully', {
      description: 'You can monitor execution logs in the sidebar Inbox tab.',
    });

    setMessage('');
    setScheduledTime('');
    setEventTrigger('');

    // Simulate completion
    setTimeout(() => {
      const currentRuns = storage.get<TaskRunRecord[]>(STORAGE_KEYS.TASK_RUNS) || [];
      const targetRun = currentRuns.find((r) => r.id === runId);
      if (targetRun) {
        targetRun.status = 'success';
        targetRun.duration = 2450;
        targetRun.summary = `Successfully executed task automation pipeline. Verified triggers, loaded task inputs, and completed task: "${taskName}".`;
        storage.set(STORAGE_KEYS.TASK_RUNS, currentRuns);
      }
    }, 3000);
  };

  return {
    taskType,
    setTaskType,
    triggerType,
    setTriggerType,
    scheduledTime,
    setScheduledTime,
    eventTrigger,
    setEventTrigger,
    handleCreateTask,
  };
}
