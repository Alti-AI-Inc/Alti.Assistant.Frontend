'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, Save, User, MessageSquare, Cpu } from 'lucide-react';
import Link from 'next/link';

const STORAGE_KEYS = {
  aboutUser: 'aphura_about_user',
  customInstructions: 'aphura_custom_instructions',
  preferredModel: 'aphura_preferred_model',
  responseStyle: 'aphura_response_style',
};

const MODELS = [
  { value: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', label: 'Llama 3.1 70B (Default)' },
  { value: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo', label: 'Llama 3.1 8B (Fast)' },
  { value: 'Qwen/QwQ-32B', label: 'QwQ 32B (Reasoning)' },
  { value: 'meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo', label: 'Llama 3.2 90B Vision' },
];

const RESPONSE_STYLES = [
  { value: 'default', label: 'Balanced' },
  { value: 'concise', label: 'Concise — short, direct answers' },
  { value: 'detailed', label: 'Detailed — thorough explanations' },
  { value: 'technical', label: 'Technical — code-focused, precise' },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [aboutUser, setAboutUser] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [preferredModel, setPreferredModel] = useState(MODELS[0].value);
  const [responseStyle, setResponseStyle] = useState('default');
  const [saved, setSaved] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setAboutUser(localStorage.getItem(STORAGE_KEYS.aboutUser) || '');
    setCustomInstructions(localStorage.getItem(STORAGE_KEYS.customInstructions) || '');
    setPreferredModel(localStorage.getItem(STORAGE_KEYS.preferredModel) || MODELS[0].value);
    setResponseStyle(localStorage.getItem(STORAGE_KEYS.responseStyle) || 'default');
  }, []);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEYS.aboutUser, aboutUser);
    localStorage.setItem(STORAGE_KEYS.customInstructions, customInstructions);
    localStorage.setItem(STORAGE_KEYS.preferredModel, preferredModel);
    localStorage.setItem(STORAGE_KEYS.responseStyle, responseStyle);
    setSaved(true);
    toast.success('Settings saved');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#e1e1e1] dark:bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-black/10 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
        <Link href="/c/new-search" className="rounded-md p-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold">Settings</h1>
      </div>

      <div className="mx-auto w-full max-w-2xl space-y-8 px-6 py-8">
        {/* Account Info */}
        <section className="space-y-1">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Signed in as <span className="font-medium text-zinc-900 dark:text-white">{session?.user?.email || '—'}</span>
          </p>
        </section>

        {/* About User */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">About You</h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Tell Aphura about yourself — role, industry, expertise. This context is included in every conversation.
          </p>
          <textarea
            value={aboutUser}
            onChange={(e) => setAboutUser(e.target.value)}
            placeholder="e.g. I'm a startup founder building fintech products. I prefer practical, actionable answers with code examples in TypeScript."
            rows={3}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
          />
        </section>

        {/* Custom Instructions */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Custom Instructions</h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            How should Aphura respond? These instructions shape every response.
          </p>
          <textarea
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="e.g. Always cite sources. Use bullet points. Keep answers under 300 words unless I ask for detail."
            rows={4}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
          />
        </section>

        {/* Model Selection */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Preferred Model</h2>
          </div>
          <select
            value={preferredModel}
            onChange={(e) => setPreferredModel(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          >
            {MODELS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </section>

        {/* Response Style */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Response Style</h2>
          <div className="grid grid-cols-2 gap-2">
            {RESPONSE_STYLES.map((style) => (
              <button
                key={style.value}
                onClick={() => setResponseStyle(style.value)}
                className={`rounded-lg border px-3 py-2 text-left text-xs transition-all ${
                  responseStyle === style.value
                    ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </section>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
        >
          <Save className="h-4 w-4" />
          {saved ? 'Saved ✓' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
