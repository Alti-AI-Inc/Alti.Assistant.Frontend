'use client';

import React from 'react';
import { Sparkles, Mail, Database } from 'lucide-react';

interface Preset {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
  taskType: 'one-time' | 'recurring';
  triggerType: 'scheduled' | 'event';
  schedule: string;
  event: string;
  color: string;
}

interface TaskPresetsProps {
  onSelectPreset: (preset: {
    prompt: string;
    taskType: 'one-time' | 'recurring';
    triggerType: 'scheduled' | 'event';
    schedule: string;
    event: string;
  }) => void;
}

export default function TaskPresets({ onSelectPreset }: TaskPresetsProps) {
  const presets: Preset[] = [
    {
      id: 'daily-report',
      title: 'Daily Report Summary',
      description: 'Generate and compile daily performance and ESG metrics reports.',
      icon: <Sparkles className="size-5 text-indigo-500" />,
      prompt: 'Audit and summarize GCP cost reports from Vertex AI and compile an automated markdown daily usage summary.',
      taskType: 'recurring',
      triggerType: 'scheduled',
      schedule: 'Every day at 9 AM',
      event: '',
      color: 'from-indigo-500/10 to-purple-500/10 hover:border-indigo-500/30',
    },
    {
      id: 'email-reply',
      title: 'Email Auto-Responder',
      description: 'Draft responses when new emails arrive from VIP clients.',
      icon: <Mail className="size-5 text-rose-500" />,
      prompt: 'Summarize key questions in the incoming client email, draft a professional response draft matching our brand guidelines, and save it in drafts.',
      taskType: 'recurring',
      triggerType: 'event',
      schedule: '',
      event: 'When a new email arrives from @client.com',
      color: 'from-rose-500/10 to-orange-500/10 hover:border-rose-500/30',
    },
    {
      id: 'storage-audit',
      title: 'Database Storage Audit',
      description: 'Scan database collections for large unused objects and alert admin.',
      icon: <Database className="size-5 text-emerald-500" />,
      prompt: 'Run clean-up checks on temporary assets, purge expired data vectors, and alert the database administrator with a storage report.',
      taskType: 'recurring',
      triggerType: 'scheduled',
      schedule: 'Every Sunday at midnight',
      event: '',
      color: 'from-emerald-500/10 to-teal-500/10 hover:border-emerald-500/30',
    },
  ];

  return (
    <div className="w-full mb-8">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
        Quick Templates
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectPreset({
              prompt: preset.prompt,
              taskType: preset.taskType,
              triggerType: preset.triggerType,
              schedule: preset.schedule,
              event: preset.event,
            })}
            className="flex flex-col items-start text-left p-5 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${preset.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0`} />
            <div className="flex items-center gap-3 mb-2 z-10">
              <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-xl group-hover:scale-110 transition-transform duration-300">
                {preset.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                {preset.title}
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed z-10">
              {preset.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
