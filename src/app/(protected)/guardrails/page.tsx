'use client';

import { useState, useEffect } from 'react';
import { Cpu, Shield, Save } from 'lucide-react';
import { toast } from 'sonner';

const STORAGE_KEYS = {
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

export default function GuardrailsPage() {
  const [model, setModel] = useState(MODELS[0].value);
  const [style, setStyle] = useState('default');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setModel(localStorage.getItem(STORAGE_KEYS.preferredModel) || MODELS[0].value);
      setStyle(localStorage.getItem(STORAGE_KEYS.responseStyle) || 'default');
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    localStorage.setItem(STORAGE_KEYS.preferredModel, model);
    localStorage.setItem(STORAGE_KEYS.responseStyle, style);
    await new Promise(r => setTimeout(r, 600));
    setIsSaving(false);
    toast.success('Guardrails saved successfully');
  };

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-zinc-950 overflow-y-auto">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-black/10 px-6 dark:border-white/10">
        <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Guardrails
        </h1>
      </header>

      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8 space-y-12 pb-24">
        {/* Preferred Model Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Preferred Model</h2>
          </div>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-[#0000ff] focus:outline-none dark:border-white/10 dark:bg-zinc-900 dark:text-white"
          >
            {MODELS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </section>

        {/* Response Style Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Response Style</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RESPONSE_STYLES.map((s) => (
              <button
                key={s.value}
                onClick={() => setStyle(s.value)}
                className={`flex items-center justify-between rounded-lg border p-4 text-left transition-all ${
                  style === s.value
                    ? 'border-[#0000ff] bg-[#0000ff]/10 text-[#0000ff] dark:text-[#8080ff]'
                    : 'border-black/10 bg-transparent text-zinc-600 hover:bg-black/5 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/5'
                }`}
              >
                <span className="text-sm">{s.label}</span>
              </button>
            ))}
          </div>
        </section>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#0000ff] text-sm font-medium text-white transition-all hover:bg-[#0000ff]/90 disabled:opacity-50"
        >
          {isSaving ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? 'Saving...' : 'Save Guardrails'}
        </button>
      </div>
    </div>
  );
}
