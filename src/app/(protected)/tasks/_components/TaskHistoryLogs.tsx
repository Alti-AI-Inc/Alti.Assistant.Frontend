'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Terminal } from 'lucide-react';

interface TaskHistoryLogsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  taskName: string;
}

export default function TaskHistoryLogs({
  isOpen,
  onOpenChange,
  taskName,
}: TaskHistoryLogsProps) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setLogs([]);
      return;
    }

    // Generate simulated terminal logs specific to the task name
    const lines = [
      `[${new Date().toISOString()}] [system] Initiating execution of task "${taskName}"...`,
      `[${new Date().toISOString()}] [system] Acquiring execution lock and loading environment credentials...`,
      `[${new Date().toISOString()}] [network] Resolving secure public endpoint routes...`,
    ];

    if (taskName.includes('Report') || taskName.includes('GCP')) {
      lines.push(
        `[${new Date().toISOString()}] [fetch] GET secure connection to https://monitoring.googleapis.com/v3...`,
        `[${new Date().toISOString()}] [status] 200 OK - connection established with Google Cloud Monitoring API`,
        `[${new Date().toISOString()}] [parse] Auditing active GCP compute instance profiles...`,
        `[${new Date().toISOString()}] [parse] Auditing active GCP Vertex AI resource endpoints...`,
        `[${new Date().toISOString()}] [compute] Aggregating cost data and compiling lifecycle metrics...`,
        `[${new Date().toISOString()}] [synthesis] Generating markdown cost optimization report...`,
        `[${new Date().toISOString()}] [system] Report compiled. Sending summary dashboard to user workspace.`
      );
    } else if (taskName.includes('Email') || taskName.includes('auto-responder')) {
      lines.push(
        `[${new Date().toISOString()}] [fetch] Connecting to IMAP server imap.gmail.com...`,
        `[${new Date().toISOString()}] [status] 200 OK - Authentication successful`,
        `[${new Date().toISOString()}] [search] Scanning INBOX for unread messages from domain "@client.com"...`,
        `[${new Date().toISOString()}] [fetch] Retrieved 1 unread message. Thread ID: t_8f7cee025...`,
        `[${new Date().toISOString()}] [agent] Running LLM analysis on message body to extract action items...`,
        `[${new Date().toISOString()}] [agent] Drafting context-aware reply using professional brand tone presets...`,
        `[${new Date().toISOString()}] [write] Writing reply to Gmail Drafts (Draft ID: d_10f8b3c84)...`,
        `[${new Date().toISOString()}] [system] Email draft saved successfully.`
      );
    } else if (taskName.includes('Storage') || taskName.includes('Database')) {
      lines.push(
        `[${new Date().toISOString()}] [db] Connecting to MongoDB Atlas cluster...`,
        `[${new Date().toISOString()}] [status] Connected - Admin privileges verified`,
        `[${new Date().toISOString()}] [db] Auditing collections sizing and indexing mappings...`,
        `[${new Date().toISOString()}] [db] Found 14 unindexed search vectors in "platform_memory" collection`,
        `[${new Date().toISOString()}] [db] Cleaning up expired temporary storage documents...`,
        `[${new Date().toISOString()}] [compute] Freed 4.2 GB of temporary storage`,
        `[${new Date().toISOString()}] [alert] Dispatching storage status summary report to Slack channels.`
      );
    } else {
      lines.push(
        `[${new Date().toISOString()}] [agent] Analyzing natural language instructions prompt...`,
        `[${new Date().toISOString()}] [agent] Planning agent action execution graph...`,
        `[${new Date().toISOString()}] [network] Resolving external tools and API schemas...`,
        `[${new Date().toISOString()}] [agent] Executing LLM reasoning engine...`,
        `[${new Date().toISOString()}] [system] Task completed successfully.`
      );
    }

    // Simulate logs printing progressively
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setLogs((prev) => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [isOpen, taskName]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-zinc-950 text-zinc-50 border-zinc-800 p-6 rounded-2xl">
        <DialogHeader className="border-b border-zinc-800 pb-3 mb-2">
          <DialogTitle className="flex items-center gap-2 text-zinc-100 font-semibold text-lg">
            <Terminal className="size-5 text-indigo-400" />
            Execution Logs: {taskName}
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-xs">
            Reviewing live telemetry logs from the automated task runner agent.
          </DialogDescription>
        </DialogHeader>

        <div className="font-mono text-xs bg-zinc-950 border border-zinc-800 rounded-xl p-4 h-[350px] overflow-y-auto flex flex-col gap-2.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {logs.map((log, index) => {
            const isSystem = log.includes('[system]');
            const isError = log.includes('[error]');
            const isStatus = log.includes('[status]');
            
            let colorClass = 'text-zinc-300';
            if (isSystem) colorClass = 'text-indigo-400 font-semibold';
            else if (isStatus) colorClass = 'text-emerald-400';
            else if (isError) colorClass = 'text-rose-500 font-semibold';

            return (
              <div key={index} className={`leading-relaxed whitespace-pre-wrap ${colorClass}`}>
                {log}
              </div>
            );
          })}
          {logs.length === 0 && (
            <div className="text-zinc-500 italic animate-pulse">Initializing terminal session...</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
